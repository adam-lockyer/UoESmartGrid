import React, { useState } from "react";
import styles from '../Consumption.module.css';
import { useQuery } from '../../../hook/useQuery';
import Loading from "../../Loading/Loading";
import DataResults from './DataResults/DataResults';


const SensorDataGraph = ({ building, sensor }) => {
    const queryData = sensor
    let mongoRefObj = ""
    let mongoIDObj = ""

    const { data, loading } = useQuery({url: `/api/ontology/${building}/ref`, toPass: queryData});
    if (data){
        mongoRefObj = data["mongoRef"][0].toString()
        mongoIDObj = data["mongoID"][0].toString()
        return <DataResults selectedSensor={queryData} queryData={mongoIDObj}/>
    }
    return (<Loading size="large"/>)

}
export default SensorDataGraph