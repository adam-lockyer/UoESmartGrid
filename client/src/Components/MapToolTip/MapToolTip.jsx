import React from 'react';
import { ResponsiveLine } from '@nivo/line'
import styles from "./MapToolTip.module.css";


const MyTooltip = ({ selectedBuilding }) => {
    const buildingList = [
        {
            latitude: 50.736942,
            longitude: -3.532983,
            name: "The CREWW Building",
            tag: "CREWW",
            buildingDescription: "Sustainability Building",
        },{
            latitude: 50.737242,
            longitude: -3.533183,
            name: "The Harrison Building",
            description:"Engineering Building",
            tag: "Harrison",
            buildingDescription: "Engineering Building",
        }
    ]
    let buildingData = null;


    buildingList.forEach((building, index) => {
        if (selectedBuilding == building.tag) {
            buildingData = building
        }
    });


    return(
        <div className={styles.tooltip}>
            <h2>{buildingData.name}</h2>
            <p>{buildingData.buildingDescription}</p>
            <br />
            <div
                className={styles.buttonSpacer}
            >
                <button
                    onClick={() =>
                        navigate(
                            `/${buildingData.tag}/Consumption`
                        )
                    }
                >
                    View Consumptions
                </button>
                <button
                    onClick={() =>
                        navigate(
                            `/forecast/${buildingData.tag}/`
                        )
                    }
                >
                    View Consumption Forecast
                </button>
            </div>
        </div>
    )
}

export default MyTooltip