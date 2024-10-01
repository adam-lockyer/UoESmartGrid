import React, { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import styles from "./Login.module.css";

import { login } from "../../actions/auth";
import { Button } from "@mui/material";

const Login = ({ login, isAuthenticated }) => {
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	function validateForm() {
		return user.length > 0 && password.length > 0;
	}
	
    useEffect(() => {
		if (isAuthenticated) {
			navigate('/Map');
			return;
		}
	}, [isAuthenticated, navigate]);

	function handleSubmit() {
		login([user, password]);
		navigate('/Map');
	}

	return (
		<div className={styles.loginPage}>
			<div className={`${styles.Login} ${styles.loginChild}`}>
				<div className={styles.loginWrapper}>
					<img className={styles.logo} src="/src/Exeter_Logo.png" alt="Exeter university logo" />
					<div className={styles.fields}>
						<input
							type="text"
							className={styles.input}
							value={user}
							onChange={(e) => setUser(e.target.value)}
							placeholder="Username"
						/>
						<input
							type="password"
							className={styles.input}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
						/>
					</div>
					<Button
						variant="contained"
						sx={{
							backgroundColor: "#00dea5",
							borderColor: "#00dea5",
							color: '#003b3c',
							fontWeight: 'bold',
							borderRadius: "2px",
							width: "100%",
							height: "4vh",
							fontSize: "0.75vw",
							fontFamily: "Montserrat, sans-serif",
							"&:hover": {
								backgroundColor: "#00b284",
							},
							"&:disabled": {
								backgroundColor: "#00dea5",
								color: '#003b3c',
								opacity: 0.6,
							}
						}}
						disabled={!validateForm()}
						onClick={() => handleSubmit()}
					>
						Login
					</Button>
				</div>
			</div>
			<div className={`${styles.hero} ${styles.loginChild}`}>
				<div className={styles.heroText}>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
