import React, { useState, useEffect } from 'react';
import {Button, Container, Navbar} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Switch,
  Route,
  Redirect,
  useHistory
} from 'react-router-dom';


import Register from './components/Register';
import Registered from './components/Registered';
import Login from './components/Login';
import UserLogout from './components/UserLogout';
import { getCookie,  getUser } from './services/AuthService'

import './style/App.css';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import Create from './components/Create';
import EditPost from './components/EditPost'

function App ({user}) {

  const [currentUser, setCurrentUser] = useState(user)

  let history = useHistory();

  const login = async (email, password) => {
    let csrfToken = getCookie('csrftoken');
    fetch('api/login/', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify({'email': email, 'password': password})
    }).then(res => res.json())
      .then(res => {
        if (res['is_active'] === true) {
          setCurrentUser(res);
          history.push('/');
        } else {
          logout();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }


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
          setCurrentUser(null);
          history.push('/');
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
        {
          currentUser &&
            <LinkContainer to='/create' className='create-button'>
              <Button
                type='submit'
                variant='primary'
                size='md'
              >Create post</Button>

            </LinkContainer>
        }
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          {
            !currentUser &&
              <Login login={login} />
          }
          {
            currentUser &&
              <UserLogout
                logout={logout}
                currentUser={currentUser}
                className='justify-content-end'
              />
          }
        </Navbar.Collapse>
      </Navbar>
      <Switch>
          <Route path='/create' render={() => (
            !currentUser ? (
              <Redirect to='/' />
            ) : (
            <Create />
            )
          )} />
          <Route path='/register' render={() => (
            currentUser ? (
              <Redirect to='/' />
            ) : (
            <Register />
            )
          )} />
          <Route path='/registered' render={() => (
            currentUser ? (
              <Redirect to='/' />
            ) : (
            <Registered />
            )
          )} />
          <Route path='/:slug/edit' render={(match) => (
            !currentUser ? (
              <Redirect to='/' />
            ) : (
            <EditPost {...match} currentUser={currentUser}/>
            )
          )} />
          <Route path='/:slug' render={(match) => (
            <PostDetail {...match} currentUser={currentUser}/>
          )} />
          <Route path='/' render={() => (
            <PostList />
          )} />
      </Switch>
    </>
  );
}

export default App;