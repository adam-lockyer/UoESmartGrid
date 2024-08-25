import axios from "axios";
import { useEffect, useState } from "react";

export const useQuery = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}${url}`
                );
                setData(res.data);   
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);

    return {
        data,
        loading,
    }
}