const axios = require("axios");
const fs = require("fs/promises");
const path = require("path");

const DEFAULT_NLQ_ENDPOINT = process.env.MAS_NLQ_URL || "http://localhost:8080/api/nlq";
const DEFAULT_DOWNLOAD_DIR = process.env.NLQ_DOWNLOAD_DIR || path.join(__dirname, "..", "downloads", "nlq");

function getFilenameFromDisposition(disposition) {
    const match = disposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    if (!match) {
        return null;
    }

    return decodeURIComponent(match[1]);
}

function sanitizeFilename(filename) {
    return path.basename(filename).replace(/[<>:"/\\|?*\x00-\x1f]/g, "_");
}

function getDefaultFilename(contentType) {
    if (contentType?.includes("application/pdf")) {
        return "downloaded-file.pdf";
    }
    if (contentType?.includes("application/json")) {
        return "downloaded-file.json";
    }
    if (contentType?.startsWith("text/")) {
        return "downloaded-file.txt";
    }

    return "downloaded-file.bin";
}

async function queryNLQ(vector) {
    const response = await axios.post(
        DEFAULT_NLQ_ENDPOINT,
        {action: {
            request: "query",
            data: Array.from(vector),
            targetURL: "http://localhost:5000"
        }},
        {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
            responseType: "arraybuffer",
        }
    );

    const contentType = String(response.headers["content-type"] || "").toLowerCase();
    const disposition = response.headers["content-disposition"];
    const responseBuffer = Buffer.from(response.data);

    console.log("[NLQ] Response status  :", response.status);
    console.log("[NLQ] Content-Type     :", contentType);
    console.log("[NLQ] Content-Disposition:", disposition ?? "(none)");
    console.log("[NLQ] Body size (bytes):", responseBuffer.length);
    console.log("[NLQ] Body preview     :", responseBuffer.subarray(0, 200).toString("utf8"));

    // If the MAS signals a file download via Content-Disposition, save it regardless
    // of content type (which reflects the file's format, not the transport encoding).
    const isAttachment = disposition?.toLowerCase().includes("attachment");

    if (!isAttachment) {
        if (contentType.includes("application/json")) {
            return {
                kind: "json",
                status: response.status,
                data: JSON.parse(responseBuffer.toString("utf8")),
            };
        }

        if (contentType.startsWith("text/")) {
            return {
                kind: "text",
                status: response.status,
                data: responseBuffer.toString("utf8"),
            };
        }
    }

    const filename = sanitizeFilename(
        getFilenameFromDisposition(disposition) || getDefaultFilename(contentType)
    );
    const downloadDir = path.resolve(DEFAULT_DOWNLOAD_DIR);
    const filePath = path.join(downloadDir, filename);

    await fs.mkdir(downloadDir, { recursive: true });
    await fs.writeFile(filePath, responseBuffer);

    return {
        kind: "fileSaved",
        status: response.status,
        data: {
            filename,
            filePath,
            contentType: contentType || "application/octet-stream",
            size: responseBuffer.length,
        },
    };
}

module.exports = {
    queryNLQ,
};