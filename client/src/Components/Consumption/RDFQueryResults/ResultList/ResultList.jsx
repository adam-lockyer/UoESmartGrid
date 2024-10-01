import React, { useEffect } from 'react'
import { useQuery } from '../../../../hook/useQuery';
import styles from '../../Consumption.module.css';
import Loading from "../../../Loading/Loading";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ResultList = ({ onOptionSelect, onBack, type, building, queryData = null }) => {
    const { data, loading } = useQuery(`/api/ontology/${building}/${type}`, queryData);
    if (loading) return <Loading size="small"/>

    const onClickBack = () => {
        if (onBack) {
            onBack(null);
        }
        onOptionSelect(null);
    }
    return (
        <div>
            {type !== "floors" ? (
                <div className={styles.backButtonContainer}>
                    
                    <div className={styles.backButton} onClick={onClickBack}><ArrowBackIcon/>Back</div>
                </div>
            ) : null}

            <div className={styles.listTitle}>Please Select A {type.charAt(0).toUpperCase() + type.slice(1, -1)}</div>
            <div className={styles.resultsContainer}>{data[type]?.map((option) => <div className={styles.result} key={option} onClick={() => onOptionSelect(option)}>{option}</div>)}</div>
        </div>
    )

}

export default ResultList