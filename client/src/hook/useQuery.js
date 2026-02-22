import axios from "axios";
import { useEffect, useState } from "react";

// export const useQuery = (url, toPass = undefined, onComplete) => {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const res = await axios.get(
//                     `${import.meta.env.VITE_API_URL}${url}`,
//                         {params: { toPass }}
//                 );
//                 setData(res.data);   
//             } catch (error) {
//                 console.log(error);
//             } finally {
//                 setLoading(false);
//                 onComplete();
//             }
//         }
//         getData();
//     }, [url]);

//     return {
//         data,
//         loading,
//     }
// }

export const useQuery = ({
    url,
    toPass = undefined,
    onComplete = () => {},
}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}${url}`,
                        {params: { toPass }}
                );
                setData(res.data);
                onComplete(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, [url]);

    return {
        data,
        loading,
    }
}