import React, { useEffect } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import { useNavigate } from "react-router-dom";

const Logout = ({ logout }) => {
	const navigate = useNavigate();
	useEffect(() => {
		logout();
		navigate('/');
	}, []);

	return (
		<div>
			<p>Logging Out...</p>
		</div>
	);
};

export default connect(null, { logout })(Logout);
