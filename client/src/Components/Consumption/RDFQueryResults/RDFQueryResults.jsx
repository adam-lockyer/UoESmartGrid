import React, { useState } from 'react'
import ResultList from './ResultList/ResultList';

const RESULT_TYPE = {
    FLOOR: 'floors',
    ROOM: 'rooms',
    DEVICE: 'devices',
    SENSOR: 'sensors',
};

const RDFQueryResults = ({ building, setSensor }) => {
    const [floor, setFloor] = useState(null);
    const [room, setRoom] = useState(null);
    const [device, setDevice] = useState(null);

    if (device) {
        return <ResultList type={RESULT_TYPE.SENSOR} onOptionSelect={setSensor} onBack={setDevice} building={building} queryData={device}/>
    }

    if (room) {
        return <ResultList type={RESULT_TYPE.DEVICE} onOptionSelect={setDevice} onBack={setRoom} building={building} queryData={room}/>
    }

    if (floor) {
        return <ResultList type={RESULT_TYPE.ROOM} onOptionSelect={setRoom} onBack={setFloor} building={building} queryData={floor}/>
    }

    return (
        <div>
            <ResultList type={RESULT_TYPE.FLOOR} onOptionSelect={setFloor} building={building}/>
        </div>
    )
}

export default RDFQueryResults