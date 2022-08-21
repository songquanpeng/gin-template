import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Router, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './components/Loading';
import User from './pages/User';
import Login from './components/LoginForm';
import Register from './components/RegisterForm';
import { history } from './helpers';
import { alertActions } from './actions';
import { PrivateRoute } from './components/PrivateRoute';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
  const alert = useSelector(state => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
  }, []);

  return (
    <Routes>
      <Route
        path='/'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/user"
        element={
          <PrivateRoute>
            <User />
          </PrivateRoute>
        }
      />
      {/*<PrivateRoute exact path="/user" component={User} />*/}  // TODO: fix PrivateRoute
      <Route path="/login" element={
        <Suspense fallback={<Loading></Loading>}>
          <LoginForm />
        </Suspense>
      } />
      <Route path="/register" element={
        <Suspense fallback={<Loading></Loading>}>
          <RegisterForm />
        </Suspense>
      } />
      <Route
        path='/about'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <About />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
