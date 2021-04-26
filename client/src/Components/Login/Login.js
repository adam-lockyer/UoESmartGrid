import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import styles from "./Login.module.css";

import { login } from "../../actions/auth";

const Login = ({ login, isAuthenticated }) => {
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");

	function validateForm() {
		return user.length > 0 && password.length > 0;
	}

	if (isAuthenticated) {
		return <Redirect to="/Map" />;
	}

	function handleSubmit(event) {
		event.preventDefault();
		login([user, password]);
	}

	return (
		<div className={styles.loginPage}>
			<div className={`${styles.Login} ${styles.loginChild}`}>
				<div className={styles.loginWrapper}>
					<h4>Please Login Below:</h4> <br />
					<Form onSubmit={handleSubmit}>
						<Form.Group size="lg" controlId="email">
							<Form.Label>Username</Form.Label>
							<Form.Control
								autoFocus
								type="user"
								value={user}
								onChange={(e) => setUser(e.target.value)}
							/>
						</Form.Group>
						<Form.Group size="lg" controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Form.Group>
						<button
							className={styles.button}
							type="submit"
							disabled={!validateForm()}
						>
							Login
						</button>
					</Form>
				</div>
			</div>
			<div className={`${styles.hero} ${styles.loginChild}`}>
				<div className={styles.heroText}>
					<h2>
						Welcome to the <br />
						<span>UoE Smart Grid</span>
					</h2>
					<p>Please log in to continue.</p>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
