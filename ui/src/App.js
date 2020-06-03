import React, { useState } from 'react';
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

function App () {

  const [isLoggedIn, setLoggedIn] = useState(() => {
      return window.localStorage.getItem('blog.auth') !== null;
    }
  );

  const [currentUser, setCurrentUser] = useState(getUser);

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
          window.localStorage.setItem(
            'blog.auth', JSON.stringify(res)
          );
          setLoggedIn(true);
          setCurrentUser(res);
          history.push('/');
        } else {
          logout();
          console.log(res);
        }
      })
      .catch((error) => {
        console.log(error);
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
          window.localStorage.removeItem('blog.auth');
          setLoggedIn(false);
          setCurrentUser(undefined);
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
          isLoggedIn &&
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
            !isLoggedIn &&
              <Login login={login} />
          }
          {
            isLoggedIn &&
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
            !isLoggedIn ? (
              <Redirect to='/' />
            ) : (
            <Create />
            )
          )} />
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
          <Route path='/:slug/edit' render={(match) => (
            <EditPost {...match}/>
          )} />
          <Route path='/:slug' render={(match) => (
            <PostDetail {...match} />
          )} />
          <Route path='/' render={() => (
            <PostList />
          )} />
      </Switch>
    </>
  );
}

export default App;