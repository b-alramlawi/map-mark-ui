import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Home from './pages/HomePage';
import LoginPage from './pages/authentication/LoginPage';
import SignUpPage from './pages/authentication/SignUpPage';
import VerificationSuccessPage from './pages/authentication/VerificationSuccessPage';
import VerificationFailedPage from './pages/authentication/VerificationFailedPage';
import ForgotPasswordPage from './pages/authentication/ForgotPasswordPage';
import ResetPasswordPage from './pages/authentication/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from "./pages/NotFoundPage";

const PrivateRoute = ({component: Component, ...rest}) => {
    const isAuthenticated = localStorage.getItem('authToken');

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : <Redirect to="/login"/>
            }
        />
    );
};

function App() {
    return (
        <Router>
            <Switch>
                {/* Public Routes */}
                <Route path="/signup" component={SignUpPage}/>
                <Route path="/login" component={LoginPage}/>
                <Route path="/v-success" component={VerificationSuccessPage}/>
                <Route path="/v-error" component={VerificationFailedPage}/>
                <Route path="/forgot-password" component={ForgotPasswordPage}/>
                <Route path="/reset-password/:token" component={ResetPasswordPage}/>

                {/* Private Routes */}
                <PrivateRoute path="/home" component={Home}/>
                <PrivateRoute path="/profile" component={ProfilePage}/>

                {/* 404 Not Found Pages routes */}
                <Route path="*" component={NotFoundPage}/>
            </Switch>
        </Router>
    );
}

export default App;
