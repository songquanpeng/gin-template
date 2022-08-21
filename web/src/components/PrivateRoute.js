import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      if (!localStorage.getItem('user')) {
        // not logged in so redirect to login page with the return url
        return <Navigate to={{ pathname: '/login', state: { from: props.location } }} />;
      }

      // logged in so return component
      return <Component {...props} />;
    }} />
  );
};

export default PrivateRoute;