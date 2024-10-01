import axios from "axios";
import { useState } from "react";

export const useMutation = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getData = async (queryParams) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}${url}`,
                    {params: { toPass: queryParams }}
            );
            setData(res.data);   
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return [
        data,
        loading,
        getData
    ]
}