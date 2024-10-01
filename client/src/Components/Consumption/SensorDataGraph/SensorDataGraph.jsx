import React from 'react'
import styles from '../Consumption.module.css';
import { useQuery } from '../../../hook/useQuery';
import Loading from "../../Loading/Loading";

const SensorDataGraph = ({ building, sensor }) => {
    if (sensor) {
        const queryData = sensor
        const { data, loading } = useQuery(`/api/ontology/${building}/ref`, queryData);
        if (loading) return <Loading size="small"/>
        const mongoRef = data["mongoRef"]
        const mongoID = data["mongoID"]
        return (
            <div className={styles.graphContainer}>
                <div className={styles.graphDisplaying}>Selected Datapoint:<p>{sensor}</p><p>returned reference data: { mongoRef }/{ mongoID } </p></div>
            </div>
        )
    } else {
        return (        
        <div className={styles.loadingDisplaying}>
            <Loading size="large" />
            <div className={styles.loadingText}>Waiting for Selection...

            </div>
            <div className={styles.animationContainer}>

            </div>
        </div>
        )
    }
}
export default SensorDataGraph