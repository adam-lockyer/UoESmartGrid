import React, { useEffect, useState } from "react";
import styles from "./RDFtest.module.css";
import axios from "axios";
import { useQuery } from "../../hook/useQuery";



const RDFtest = () => {
    const [sensors, setSensors] = useState([]);
    const [devices, setDevices] = useState([]);
    const [customData, setCustomData] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(false);
    const toPass = "B0"
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/ontology/CREWW/sensors`
                );
                setSensors(res.data.sensors);   
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/ontology/CREWW/devices`
                );
                setDevices(res.data.devices);   
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);

    const { data, loading: floorsLoading } = useQuery({url: '/api/ontology/CREWW/floors'});
    const floors = data?.floors;

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/ontology/CREWW/rooms`, {
                        params: {toPass}
                    }
                );
                setRooms(res.data.rooms);   
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/ontology/CREWW/custom`
                );
                setCustomData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getData();


    }, []);

    if (loading || floorsLoading) return <p>Loading...</p>

    return (
        <div >
            <h1>RDF Test</h1>
            <h5>Check the console for parsed RDF data.</h5>
            <div className={styles.container}>
                <div className={styles.lists}>
                    {floors?.map((floor) => <p>{floor}</p>)}
                </div>
                <div className={styles.lists}>
                    {rooms.map((room) => <p>{room}</p>)}
                </div>
                <div className={styles.lists}>
                    {sensors.map((sensor) => <p>{sensor}</p>)}
                </div>
                <div className={styles.lists}>
                    {devices.map((device) => <p>{device}</p>)}
                </div>
                <div className={styles.lists}>
                    {customData.map((data) => <p>{data}</p>)}
                </div>
            </div>

        </div>
    );
};



export default RDFtest;
