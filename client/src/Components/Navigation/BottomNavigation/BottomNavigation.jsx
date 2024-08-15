import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./BottomNavigation.module.css";

import FolderIcon from '@mui/icons-material/Folder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';

const BottomNavigation = () => {
	let loc = useLocation();
	loc = loc.pathname.split("/")[1];
	return (
		<div className={styles.bottomNavWrapper}>
			<div className={styles.bottomNav}>
				<div
					className={`${styles.bottomNavItem} ${
						loc === "Map" || loc === "Login" ? styles.active : ""
					}`}
				>
					<Link to="/Map">
						<LocationOnIcon
							fontSize={
								loc === "Map" || loc === "Login"
									? "large"
									: "default"
							}
						/>
						<p>Smart Grid</p>
					</Link>
				</div>
				<div
					className={`${styles.bottomNavItem} ${
						loc === "" ? styles.active : ""
					}`}
				>
					<Link to="/">
						<HomeIcon fontSize={loc === "" ? "large" : "default"} />
						<p>Home</p>
					</Link>
				</div>
				<div
					className={`${styles.bottomNavItem} ${
						loc === "Info" ? styles.active : ""
					}`}
				>
					{" "}
					<Link to="/Info">
						<FolderIcon
							fontSize={loc === "Info" ? "large" : "default"}
						/>
						<p>Information</p>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default BottomNavigation;
