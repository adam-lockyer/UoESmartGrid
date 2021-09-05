import React from "react";
import styles from "./Home.module.css";
const moment = require("moment");

export const Home = () => {
	const endDate = moment().subtract(14, "d");
	console.log(endDate);
	return (
		<div>
			<div className={styles.hero}>
				<div className={styles.heroText}>
					<h4>University Of Exeter Smart Grid</h4>
					<br />
					<p>
						This is the home page for the smart grid. To use use
						app, please press the pylon in the header
					</p>
					<div className={`${styles.leftAlign} ${styles.heroChild}`}>
						<br />
						<h4>General Information</h4>
						<p>
							A smart grid is an electrical grid which includes a
							variety of operation and energy measures including
							smart meters, smart appliances, renewable energy
							resources, and energy efficient resources.[1][2]
							Electronic power conditioning and control of the
							production and distribution of electricity are
							important aspects of the smart grid.[3] Smart grid
							policy is organized in Europe as Smart Grid European
							Technology Platform.[4] Policy in the United States
							is described in 42 U.S.C. ch. 152, subch. IX §
							17381. Roll-out of smart grid technology also
							implies a fundamental re-engineering of the
							electricity services industry, although typical
							usage of the term is focused on the technical
							infrastructure.[5]
						</p>
						<br />
					</div>
					<div className={`${styles.rightAlign} ${styles.heroChild}`}>
						<br />
						<h4>Using the App</h4>
						<p>
							Google Maps began as a C++ desktop program at Where
							2 Technologies. In October 2004, the company was
							acquired by Google, which converted it into a web
							application. After additional acquisitions of a
							geospatial data visualization company and a real
							time traffic analyzer, Google Maps was launched in
							February 2005.[1] The service's front end utilizes
							JavaScript, XML, and Ajax. Google Maps offers an API
							that allows maps to be embedded on third-party
							websites,[2] and offers a locator for businesses and
							other organizations in numerous countries around the
							world. Google Map Maker allowed users to
							collaboratively expand and update the service's
							mapping worldwide but was discontinued from March
							2017. However, crowdsourced contributions to Google
							Maps were not discontinued as the company announced
							those features would be transferred to the Google
							Local Guides program.[3]
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
