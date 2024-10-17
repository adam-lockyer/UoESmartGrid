import React, { useState } from 'react';
import { Button, Box, Grid, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const Carousel = ({ items, onIndexChange }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
        onIndexChange(prevIndex);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
        onIndexChange(prevIndex);
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
            }}>
            <ArrowBackIosIcon onClick={handlePrev} sx={{ cursor: 'pointer' }}></ArrowBackIosIcon>
            <Typography variant="h5" sx={{ paddingRight: '5px' }}>{items[currentIndex]}</Typography>
            <ArrowForwardIosIcon onClick={handleNext} sx={{ cursor: 'pointer' }}></ArrowForwardIosIcon>
        </Box>
    );
};

export default Carousel;