import axios from "axios";
import { useEffect, useState } from "react";



export const useDashboard = ({
    toPass = undefined,
    onComplete = () => {},
}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    if (!toPass || !toPass.request || !toPass.data) {
        return { data, loading };
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.post(`http://localhost:8080/api/dashboard`,
                    {
                        action: {
                            request: toPass.request,
                            data: toPass.data,
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


export const useOntology = ({
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
                const res = await axios.post(`http://localhost:8080/api/ontology/send`, 
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


export const useDatabase = ({
    toPass = undefined,
    onComplete = () => {},
}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    let stringQuery = false

    if (!toPass || !toPass.collection || !toPass.field || !toPass.key) {
        if(!toPass.stringQuery){
            stringQuery = true
        }else{
            return { data, loading };
        }
    }
    let action;
    if (stringQuery) {
        action = {
            collection: toPass.collection,
            field: toPass.field,
            key: toPass.key,
        };
    } else {
        action = {
            query: toPass.stringQuery
        };
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.post(`http://localhost:8080/api/database/send`, 
                    { action }, {
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

