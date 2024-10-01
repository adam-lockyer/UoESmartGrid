import React, { useEffect, useState } from 'react'
import RDFQueryResults from './RDFQueryResults/RDFQueryResults';
import SensorDataGraph from './SensorDataGraph/SensorDataGraph';

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
        <SensorDataGraph building={building} sensor={sensor} />
      </div>
    </div>
  )
}

export default Consumption