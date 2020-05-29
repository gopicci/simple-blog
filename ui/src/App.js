import React, { useState } from "react";
import { Container, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";

import Register from './components/Register';
import Registered from './components/Registered';
import Login from './components/Login';
import UserLogout from './components/UserLogout';
import { getCookie,  getUser } from './services/AuthService'

import './App.css';

function App () {

  const [isLoggedIn, setLoggedIn] = useState(() => {
      return window.localStorage.getItem('blog.auth') !== null;
    }
  );

  const [currentUser, setCurrentUser] = useState(getUser);

  const login = async (email, password) => {
    try {
      let csrfToken = getCookie('csrftoken');
      fetch('api/login/', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({"email": email, "password": password})
      }).then(res => res.json())
        .then(res => {
          if (res['is_active'] === true) {
            window.localStorage.setItem(
              'blog.auth', JSON.stringify(res)
            );
            setLoggedIn(true);
            setCurrentUser(res);
          } else {
            logout();
            console.log(res);
          };
        });

    } catch (e) {
      console.error(e);
    };
  };


  const logout = async () => {
    try {
      let csrfToken = getCookie('csrftoken');
        fetch('api/logout/', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        }
      }).then(() => {
          window.localStorage.removeItem('blog.auth');
          setLoggedIn(false);
          setCurrentUser(undefined);
        })
    } catch (e) {
      console.error(e);
    };
  };


  return (
    <>
      <Navbar bg='light' expand='lg' variant='light'>
        <LinkContainer to='/'>
          <Navbar.Brand className='logo'>Simple blog</Navbar.Brand>

        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {
            !isLoggedIn &&
              <Login login={login} />
          }
          {
            isLoggedIn &&
              <UserLogout
                logout={logout}
                currentUser={currentUser}
                className="justify-content-end test"
              />
          }
        </Navbar.Collapse>
      </Navbar>
      <Switch>
          <Route path='/register' render={() => (
            isLoggedIn ? (
              <Redirect to='/' />
            ) : (
            <Register />
            )
          )} />
          <Route path='/registered' render={() => (
            isLoggedIn ? (
              <Redirect to='/' />
            ) : (
            <Registered />
            )
          )} />
      </Switch>
    </>
  );
}

export default App;