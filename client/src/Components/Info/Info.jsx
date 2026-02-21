import React from "react";
import poiMarker from "./imgMarker.png";
import consumptionImage from "./ConsumptionInfo.png";
import FolderIcon from '@mui/icons-material/Folder';

import styles from "./Info.module.css";

const Info = () => {
	return (
	<div>
		<div className={styles.contentSection}>
			<img src="/logopng.png" alt="University Of Exeter Smart Grid" className={styles.logo} />
			<hr className={styles.divider} />
			<div className={styles.contentBlockL}>
				<h4>Smart Grid Information</h4>
				<p>
				This website is part of an ongoing project at Exeter University's Streatham Campus, managed by the Faculty of Environment and Economy. Our initiative focuses on developing a state-of-the-art smart grid application that utilizes OWL ontologies to provide users with comprehensive insights into building, including energy, water and gas metrics. The platform also incorporates AI-driven forecasting to enhance building management and sustainability. By integrating these advanced technologies, we aim to contribute to a more sustainable future and advance the field of smart building management.
				</p>
			</div>
			<hr className={styles.divider} />
			<div className={styles.contentBlockR}>
				<h4>Website Features</h4>
				<p> Explaination of website features here</p>
			</div>
			<hr className={styles.divider} />
			<div className={styles.contentBlockL}>
				<h4>Project Goals</h4>
				<ul>
					<li>Develop a Comprehensive Ontology: Create a detailed and extensive ontology of the campus that encompasses all relevant building structures and systems.</li>
					<li>Facilitate Smart Building Control: Implement advanced smart building control mechanisms to enhance operational efficiency and management.</li>
					<li>Encourage Further Research: Provide a robust platform that supports and stimulates additional research and innovation in smart building technologies.</li>
					<li>Verify Feasibility of Alternative Energy Control Methods: Assess and verify the effectiveness of various alternative energy control methods to identify and implement the most viable solutions.</li>
					<li>Decrease Overall Wastage in Building Consumption: Focus on reducing energy wastage and improving efficiency across building consumption to promote sustainability.</li>
				</ul>
			</div>
			<hr className={styles.divider} />
			<div className={styles.contentBlockR}>
				<h4>About Us</h4>
				<ul>
					<li>Adam Lockyer</li>
					<li>Baris Yuce</li>
					<li>Person 3</li>
					<li>Person 4</li>
					<li>Person 5</li>
				</ul>
			</div>
		</div>
		{/* <div className={styles.pageDesign}>
			<div className={`${styles.infoChild} ${styles.toUnderline}`}>
				<div className={`${styles.iconImage} ${styles.Images}`}>
					<img src={poiMarker} alt="" />
				</div>
				<div className={styles.iconText}>
					An icon is shown on the smart grid, click it and...
				</div>
			</div>

			<div className={`${styles.infoChild} ${styles.toUnderline}`}>
				<div className={`${styles.consumptionImage} ${styles.Images}`}>
					<img src={consumptionImage} alt="" />
				</div>
				<div className={styles.consumptionText}>
					Once a desired building has been selected, interact with the
					button to proceed...
				</div>
			</div>

			<div className={styles.infoChild}>
				<div className={`${styles.topNavImage} ${styles.Images}`}>
					<img alt="" src="/pylon2.png" width="30" height="30" />
					Streatham Smart Grid
				</div>
				<div className={styles.topNavText}>
					To use the navigation on a desktop, please do...
				</div>
			</div>

			<div className={styles.infoChild}>
				<div
					className={`${styles.bottomNavImage} ${styles.Images} ${styles.folderImage}`}
				>
					<FolderIcon fontSize="large" />
					<p>Information</p>
				</div>
				<div className={styles.bottomNavText}>
					To use the navigation on a mobile device, please do...
				</div>
			</div>
		</div> */}
	</div>
	);
};

export default Info;