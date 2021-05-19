import "./App.css";
// React
import React, { useEffect } from "react";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./util/setAuthToken";
// Router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Bootstrap & MatUI & other libraries
import "bootstrap/dist/css/bootstrap.min.css";
import { isMobile } from "react-device-detect";
// Components
import { Home } from "./Components/Home/Home";
import Map from "./Components/Map/Map";
import { Info } from "./Components/Info/Info";
import Login from "./Components/Login/Login";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import BottomNavigation from "./Components/Navigation/BottomNavigation/BottomNavigation";
import TopNavigation from "./Components/Navigation/TopNavigation/TopNavigation";
import Consumption from "./Components/Consumption/Consumption";
import Detailed from "./Components/Detailed/detailed";
import Forecast from "./Components/Forecast/forecast";
import Logout from "./Components/Logout/Logout";

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
				/>
				<div className="App">
					{!isMobile && <TopNavigation />}
					{isMobile && (
						<>
							<BottomNavigation />
						</>
					)}
				</div>
				<Switch>
					<Route path="/" component={Home} exact />
					<PrivateRoute path="/map" component={Map} exact />
					<Route path="/info" component={Info} exact />
					<Route path="/login" component={Login} exact />
					<PrivateRoute
						path="/:building/Consumption"
						component={Consumption}
						exact
					/>
					<PrivateRoute
						path="/room/:Room/:date"
						component={Detailed}
						exact
					/>
					<PrivateRoute
						path="/forecast/:building"
						component={Forecast}
						exact
					/>
					<PrivateRoute path="/logout" component={Logout} exact />
				</Switch>
			</Router>
		</Provider>
	);
}

export default App;
