import React, { useEffect, useState } from 'react'
import RDFQueryResults from './RDFQueryResults/RDFQueryResults';
import SensorDataGraph from './SensorDataGraph/SensorDataGraph';
import Loading from "../Loading/Loading";
import styles from './Consumption.module.css';
import { useParams } from 'react-router-dom';

const Consumption = () => {

  let { building } = useParams();
  const [sensor, setSensor] = useState(null);

  return (
    <div className={styles.container}>
      <div className={styles.dataList}>
        <RDFQueryResults setSensor={setSensor} building={building} />
      </div>
      <div className={styles.dataGraph}>
        {sensor ? (
          <SensorDataGraph building={building} sensor={sensor} />
          ) : (
            <div className={styles.loadingDisplaying}>
              <Loading size="large" />
              <div className={styles.loadingText}>Waiting for Selection...</div>
            </div>
          )
        }
        
      </div>
    </div>
  )
}

export default Consumption