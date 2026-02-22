import "./App.css";
// React
import React, { useEffect } from "react";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./util/setAuthToken";
// Router
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Bootstrap & MatUI & other libraries
import "bootstrap/dist/css/bootstrap.min.css";
import { isMobile } from "react-device-detect";
// Components
import { Home } from "./Components/Home/Home";
import Map from "./Components/Map/Map";
import MapTest from "./Components/Map/Map_Test";
import { Info } from "./Components/Info/Info";
import Login from "./Components/Login/Login";
import BottomNavigation from "./Components/Navigation/BottomNavigation/BottomNavigation";
import TopNavigation from "./Components/Navigation/TopNavigation/TopNavigation";
import Consumption from "./Components/Consumption/Consumption";
import Detailed from "./Components/Detailed/detailed";
import Forecast from "./Components/Forecast/forecast";
import Logout from "./Components/Logout/Logout";
import Contact from "./Components/Contact/Contact";
import RDFtest from "./Components/test_page/RDFtest.jsx";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";

// Check token
if (localStorage.token) {
	setAuthToken(localStorage.token);
}

function App() {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);
	return (
		<Provider store={store}>
			<Router>
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={true}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					style={{
						top: '5rem',
					}}
				/>
				<div className="App">
					{!isMobile && <TopNavigation />}
					{isMobile && (
						<>
							<BottomNavigation />
						</>
					)}
				</div>
				<Routes>
					<Route path="/" element={<Home />} exact />
					<Route path="/info" element={<Info />} exact />
					<Route path="/login" element={<Login />} exact />
					<Route path="/Contact" element={<Contact />} exact />
					<Route path="/Test" element={<RDFtest/>} exact />
					

					<Route
						path="/:building/Consumption"
						element={
								<PrivateRoute>
									<Consumption />
								</PrivateRoute>
								}
						exact
					/>
					<Route
						path="/room/:Room/:date"
						element={
								<PrivateRoute>
									<Detailed />
								</PrivateRoute>
								}
						exact
					/>
					<Route
						path="/forecast/:building"
						element={
								<PrivateRoute>
									<Forecast />
								</PrivateRoute>
								}
						exact
					/>
					
					<Route path="/logout" element={<Logout />} exact />

					<Route
						path="/map" 
						element={
								<PrivateRoute>
									<Map />
								</PrivateRoute>
								} 
						exact 
					/>
					<Route
						path="/MapTest" 
						element={
								<PrivateRoute>
									<MapTest />
								</PrivateRoute>
								} 
						exact 
					/>
				</Routes>
			</Router>
		</Provider>
	);
}

export default App;
