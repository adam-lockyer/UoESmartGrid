import React from "react";
import poiMarker from "./imgMarker.png";
import consumptionImage from "./ConsumptionInfo.png";
import FolderIcon from "@material-ui/icons/Folder";

import styles from "./Info.module.css";

export const Info = () => {
	return (
		<div className={styles.pageDesign}>
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
		</div>
	);
};
