import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./TopNavigation.module.css";
import { Navbar, Nav } from "react-bootstrap";

const TopNavigation = ({ isAuthenticated }) => {
	const location = window.location.pathname;
	const pathLocation = location.split("/")[1];
	return (
		<div className={styles.topNav}>
			<Navbar defaultExpanded expand="sm" bg="light" variant="light">
				<Navbar.Brand active={(pathLocation === "Map").toString()}>
					<Link to="/Map" className={styles.LogoLink}>
						<img
							alt=""
							src="/logo.png"
							height="40"
							className="mr-auto"
						/>
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
					{/* First three links centered */}
					<Nav className="mx-auto">
						<Link to="/" style={{textDecoration: 'none', margin: '0 10px'}}>Home Page</Link>
						<Link to="/Info" style={{textDecoration: 'none', margin: '0 10px'}}>Information</Link>
						<Link to="/Contact" style={{textDecoration: 'none', margin: '0 10px'}}>Contact Us</Link>
					</Nav>
					{/* Last two links aligned to the end */}
					<Nav>
						{!isAuthenticated && <Link to="/Login" className={styles.Login}>Login</Link>}
						{isAuthenticated && <Link to="/Logout" className={styles.Logout}>Logout</Link>}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(TopNavigation);
