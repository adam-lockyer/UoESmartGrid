import React, { useRef, useState } from 'react'
import { useQuery } from '../../../../hook/useQuery';
import { datetimeDataFilter } from '../../../../hook/useDatetimeDataFilter';
import { useContainerDimensions } from '../../../../hook/useContainerDimensions';
import styles from '../../Consumption.module.css';
import Loading from "../../../Loading/Loading";
import ButtonCarousel from "../../../ButtonCarousel/ButtonCarousel";
import MyResponsiveLine from "../../../LineGraph/LineGraph"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField, DialogContent, Typography } from '@mui/material';
import dayjs from 'dayjs';

const filterRows = (data, x) => {
    return data.filter((_, index) => index % x === 0);
  };

const DataResults = ({ selectedSensor, queryData }) => {
    const graphTitle = (selectedSensor.replace(/_/g, " ")).split('-')[0];
    const { data, loading } = useQuery(`/api/mongoPull/sensor`, queryData);
    const graphRef = useRef(null)
    const { width, height } = useContainerDimensions(graphRef)
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
    const intervalData = {text: ['5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '3d', '7d'], interval: [5, 15, 30, 60, 120, 240, 360, 720, 1440, 4320, 10080]}

    const handleDataLoaded = () => {
        const dataLists = {}
        intervalData["interval"].forEach((interval) => {
            dataLists[interval] = datetimeDataFilter(data, interval);
        });
        return dataLists
    }



    if (loading) return <Loading size="large"/>

    const allData = handleDataLoaded()
    console.log(data)
    console.log(allData)

    const arraySkip = (Math.ceil(data.length/200)).toString()
    const tickTime = ((Math.ceil(data.length/200))*5).toString()
    const tickString = "every "+tickTime+" minutes";
    const nivoData = filterRows(data, arraySkip);
    // const [selectedIndex, setSelectedIndex] = useState(0);

    const LineData = [
		{
			id: selectedSensor,
            color: "hsl(271, 70%, 50%)",
			data: nivoData?.map((cons) => {
				const timeEpoch = Date.parse(cons.datetime);
				const outDate = new Date(timeEpoch).toISOString().substr(0, 10);
				const outTime = new Date(timeEpoch).toISOString().substr(11, 5);
				let XAxis = `${outDate} ${outTime}`;
				return {
					x: XAxis,
					y: cons.value,
				};
			}),
		},
	];

    
    const handleGraphUpdate = () => {
        console.log("UPDATE GRAPH -- Start Time = ", startDate," -- End Time = ", endDate)
        const filteredData = data.filter(row => {
            const dateTime = new Date(row.datetime);
            return dateTime >= startDate && dateTime <= endDate;
          });
        console.log(data.length, " : ", filteredData.length)
    }

    const handleStartDate = (e) => {
		setStartDate(Date.parse(e));
        console.log(startDate)
        if (endDate){
            handleGraphUpdate()
        }
	};

    const handleStartWipe = () => {
		setStartDate(null);
	};

    const handleEndDate = (e) => {
        setEndDate(Date.parse(e));
        console.log(endDate)
        if (startDate){
            handleGraphUpdate()
        }
    };
    
    const handleEndWipe = () => {
		setEndDate(null);
	};

    const handleIndexChange = (index) => {
        setSelectedIndex(index);
        console.log(`Current selected index: ${index}`);
    };

    return (
        <div className={styles.graphContainer}>
            <div className={styles.aboveGraph}>
                <div className={styles.graphTitle}>Graph of {graphTitle}</div>
                    <div className={styles.timePicker}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                slotProps={{
                                    textField: {
                                        readOnly:true,
                                        sx: {
                                            '& .MuiInputBase-input': {
                                                color: '#ffffff',  // Input text color
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                borderColor: '#00dea5', // Default border color
                                                },
                                                '&:hover fieldset': {
                                                borderColor: '#00dea5', // Border color on hover
                                                },
                                                '&.Mui-focused fieldset': {
                                                borderColor: '#00dea5', // Border color when focused
                                                },
                                            },
                                            '& .MuiFormLabel-root': {
                                                color: '#ffffff', // Label (title) color
                                                '&.Mui-focused': {
                                                    color: '#ffffff', // Border color when focused
                                                },
                                            },
                                            '& .MuiSvgIcon-root': {
                                                color: '#ffffff', // Icon color (e.g., calendar icon)
                                            },
                                        }
                                    },
                                }}
                                // defaultValue={dayjs(LineData[0].data[0].x)}
                                label="Start Time"
                                views={['year', 'day', 'hours', 'minutes']}
                                minDateTime={dayjs(data[0].datetime)}
                                maxDateTime={dayjs()}
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                }}
                                onAccept={(newValue) => handleStartDate(newValue.$d)}
                                // onChange={handleStartWipe()}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className={styles.timePicker}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                slotProps={{
                                    textField: {
                                        readOnly:true,
                                        sx: {
                                            '& .MuiInputBase-input': {
                                                color: '#ffffff',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#00dea5',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#00dea5',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#00dea5',
                                                },
                                                '&.Mui-disabled': {
                                                    '& fieldset': {
                                                        borderColor: '#a0a0a0',
                                                    },
                                                },
                                            },
                                            '& .MuiFormLabel-root': {
                                                color: '#ffffff',
                                                '&.Mui-focused': {
                                                    color: '#ffffff',
                                                },
                                                '&.Mui-disabled': {
                                                    color: '#a0a0a0',
                                                },
                                            },
                                            '& .MuiSvgIcon-root': {
                                                color: startDate ? '#ffffff' : '#a0a0a0'
                                            },
                                            '& .Mui-disabled': {
                                                backgroundColor: '',
                                                color: '#a0a0a0'
                                            },
                                        }
                                    },
                                }}
                                // defaultValue={dayjs(LineData[0].data[LineData[0].data.length-1].x)}
                                label="End Time"
                                views={['year', 'day', 'hours', 'minutes']}
                                minDateTime={startDate ? dayjs(startDate) : dayjs().add(1000, 'year')} 
                                maxDateTime={dayjs()}
                                disabled={!startDate}
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                }}
                                onAccept={(newValue) => handleEndDate(newValue.$d)}
                                // onChange={handleEndWipe()}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className={styles.intervalCarousel}>
                        <ButtonCarousel items={['5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '3d', '7d']} onIndexChange={handleIndexChange} />
                        {/* {endDate ? (<ButtonCarousel items={['5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '3d', '7d']}/>):(<></>)} */}
                    </div>
            </div>
            
            <div className={styles.graphDisplaying} ref={graphRef}>
                <MyResponsiveLine
                    LineData={LineData}
                    tickFormat={tickString}
                    graphWidth={width}
                    graphHeight={height}
                />
            </div>
            {/* <div className={styles.resultsContainer}>{data?.map((option) => <div className={styles.result} key={option} >{option}</div>)}</div> */}
        </div>
    )

}

export default DataResults