import React from "react";
import styles from "./Home.module.css";
import moment from "moment";
import Button from '@mui/material/Button';

export const Home = () => {
	const endDate = moment().subtract(14, "d");
	console.log(endDate);
	return (
		<div>
			{/* Title Section */}
			<div className={styles.hero}>
			
				<div className={styles.heroText}>
					<img src="/logopng.png" alt="University Of Exeter Smart Grid" className={styles.logo} />
					<h2 className={styles.introText}>Welcome to the University of Exeter Smart Grid Website</h2>
					<div className={styles.buttonContainer}>
						<Button
							variant="contained"
							sx={{ 
								backgroundColor: '#2066d6',
								borderColor: '#325de6',
								borderRadius: '2px',
								width: '10vw',
								height: '4vh',
								fontSize: '0.75vw',
								fontFamily: 'Montserrat, sans-serif',
								'&:hover': {
									backgroundColor: '#003cff',

								}
							}}
							href="/Login"
							rel="noopener noreferrer"
						>
							Login
						</Button>
						<Button 
						variant="outlined" 
						sx={{ 
							borderColor:"#2066d6",
							backgroundColor: "rgba(255,255,255, 0.4)",
							color:"#000000",
							borderRadius: '2px',
							width: '20vw',
							height: '4vh',
							fontSize: '0.75vw',
							fontFamily: 'Montserrat, sans-serif',
							'&:hover': {
								backgroundColor: 'rgba(213,213,213, 0.8)',

							}

						}}
						href="https://www.exeter.ac.uk"
						target="_blank"
						rel="noopener noreferrer"
						>
  						Visit The University of Exeter Website
						</Button>
					</div>
				</div>
			</div>

			{/* Text Content Section */}
			<div className={styles.contentSection}>
				<div className={styles.contentBlock}>
					<h4>Smart Grid Information</h4>
					<p>
					This website is part of an ongoing project at Exeter University's Streatham Campus, managed by the Faculty of Environment and Economy. Our initiative focuses on developing a state-of-the-art smart grid application that utilizes OWL ontologies to provide users with comprehensive insights into building, including energy, water and gas metrics. The platform also incorporates AI-driven forecasting to enhance building management and sustainability. By integrating these advanced technologies, we aim to contribute to a more sustainable future and advance the field of smart building management.
					</p>
				</div>
			</div>
		</div>
	);
};
