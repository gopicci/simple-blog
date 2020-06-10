import React, { useState } from "react";
import { Button, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Register from "./components/Register";
import Registered from "./components/Registered";
import Login from "./components/Login";
import UserLogout from "./components/UserLogout";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import Create from "./components/Create";
import EditPost from "./components/EditPost";

import "react-toastify/dist/ReactToastify.css";
import "./style/App.css";

/**
 * Main app component, defines routes and navbar
 *
 * @param {json} user Gets user detail before rendering
 */
function App({ user }) {
  const [currentUser, setCurrentUser] = useState(user);

  const loginUpdate = (user) => {
    setCurrentUser(user);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" variant="light">
        <LinkContainer to="/">
          <Navbar.Brand className="logo">Simple blog</Navbar.Brand>
        </LinkContainer>
        {currentUser && (
          <LinkContainer to="/create" className="create-button">
            <Button type="submit" variant="primary" size="md">
              Create post
            </Button>
          </LinkContainer>
        )}
        <Navbar.Toggle />
        <Navbar.Collapse className="navbar-collapse justify-content-end">
          {!currentUser && <Login loginUpdate={loginUpdate} />}
          {currentUser && (
            <UserLogout
              loginUpdate={loginUpdate}
              currentUser={currentUser}
              className="justify-content-end"
            />
          )}
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route
          path="/create"
          render={() => (!currentUser ? <Redirect to="/" /> : <Create />)}
        />
        <Route
          path="/register"
          render={() => (currentUser ? <Redirect to="/" /> : <Register />)}
        />
        <Route
          path="/registered"
          render={() => (currentUser ? <Redirect to="/" /> : <Registered />)}
        />
        <Route
          path="/:slug/edit"
          render={(match) =>
            !currentUser ? (
              <Redirect to="/" />
            ) : (
              <EditPost {...match} currentUser={currentUser} />
            )
          }
        />
        <Route
          path="/:slug"
          render={(match) => (
            <PostDetail {...match} currentUser={currentUser} />
          )}
        />
        <Route path="/" render={() => <PostList />} />
      </Switch>
      <ToastContainer />
    </>
  );
}

export default App;
