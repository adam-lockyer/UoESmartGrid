import React, { useState } from 'react';
import { Button, Box, Grid, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { INTERVALS_TEXT, MAX_DATAPOINTS } from '../../util/constants/consumption';


const Carousel = ({ intervals, onIndexChange, selectedIntervalIndex }) => {
    const isPrevDisabled = intervals[selectedIntervalIndex - 1].length > MAX_DATAPOINTS;

    const handleNext = () => {
        if (selectedIntervalIndex === intervals.length - 1) return;
        onIndexChange(selectedIntervalIndex + 1);
    };

    const handlePrev = () => {
        if (selectedIntervalIndex === 0) return;
        if (isPrevDisabled) return;
        onIndexChange(selectedIntervalIndex - 1);
    };

    console.log(intervals);

    const prevDisabledStyles = {
        cursor: 'auto',
        opacity: 0.5,
        pointerEvents: 'none',
    };

    return (
        <Box             
            sx={{ 
                width: '75px', 
                textAlign: 'center', 
                margin: 'auto', 
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60px',
                marginLeft:'10px',
                marginRight:'20px',
                color:'#ffffff',
                fontSize: '1.5rem'
            }}>
            <ArrowBackIosIcon onClick={handlePrev} sx={{ cursor: 'pointer', ...(isPrevDisabled && prevDisabledStyles)}}></ArrowBackIosIcon>
            <Box sx={{ paddingRight: '5px' }}>{INTERVALS_TEXT[selectedIntervalIndex]}</Box>
            <ArrowForwardIosIcon onClick={handleNext} sx={{ cursor: 'pointer' }}></ArrowForwardIosIcon>
        </Box>
    );
};

export default Carousel;