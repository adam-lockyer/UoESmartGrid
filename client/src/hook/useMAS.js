import axios from "axios";
import { useEffect, useState } from "react";

export const useMAS = ({
    toPass = undefined,
    onComplete = () => {},
}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    if (!toPass || !toPass.subject || !toPass.predicate || !toPass.object) {
        return { data, loading };
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.post(`http://localhost:8080/api/jade/send`, 
                    {
                        action: {
                            subject: toPass.subject,
                            predicate: toPass.predicate,
                            object: toPass.object,
                        }
                    }, {
                        headers: { "Content-Type": "application/json" }
                    });
                setData(res.data);
                onComplete(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        
        getData();
    }, []);

    return {
        data,
        loading,
    };
};

