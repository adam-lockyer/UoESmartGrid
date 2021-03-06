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
					<Link to="/Map">
						<img
							alt=""
							src="/logo.png"
							height="40"
							className="mr-auto"
						/>
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto"></Nav>
					<Nav className="justify-center-end">
						<Link to="/">Home Page</Link>
					</Nav>
					<Nav className="justify-center-end">
						<Link to="/Info">Infomation</Link>
					</Nav>
					<Nav className="justify-center-end">
						{isAuthenticated && <Link to="/Logout">Logout</Link>}
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
