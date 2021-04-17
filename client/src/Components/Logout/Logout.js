import React, { useEffect } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";

const Logout = ({ logout }) => {
	useEffect(() => {
		logout();
	}, []);
	return (
		<div>
			<p>Logging Out...</p>
		</div>
	);
};

export default connect(null, { logout })(Logout);
