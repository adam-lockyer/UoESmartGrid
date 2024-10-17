import axios from "axios";
import { useEffect, useState } from "react";

export const useMongoPull = (url, toPass = undefined) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            setLoading(true); // Set loading state to true
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}${url}`,
                    { params: { toPass } }
                );
                setData(res.data);   
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [url, toPass]);

    return {
        data,
        loading,
    }
}