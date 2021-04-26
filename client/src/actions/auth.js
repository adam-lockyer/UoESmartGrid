import axios from "axios";
import setAuthToken from "../util/setAuthToken";
import {
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	AUTH_ERROR,
	LOGOUT,
	USER_LOADED,
} from "./types";
import { toast } from "react-toastify";

// Load User
export const loadUser = () => async (dispatch) => {
	if (localStorage.token) {
		// if token exists
		setAuthToken(localStorage.token);
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/api/auth/loadUser/${localStorage.token}`
			);
			dispatch({ type: USER_LOADED, payload: res.data });
		} catch (error) {
			dispatch({ type: AUTH_ERROR });
		}
	} else {
		dispatch({ type: AUTH_ERROR });
	}
};

// Login User
export const login = (formData) => async (dispatch) => {
	const [user, password] = formData;
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const body = JSON.stringify({ user, password });
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/api/auth/login`,
			body,
			config
		);
		toast.success("Successfully Logged In");
		dispatch({ type: LOGIN_SUCCESS, payload: res.data });
		dispatch(loadUser());
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: LOGIN_FAIL });
	}
};

export const logout = () => (dispatch) => {
	dispatch({ type: LOGOUT });
};
