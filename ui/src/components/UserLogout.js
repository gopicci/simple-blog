import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { getCookie } from "../services/AuthService";

/**
 * Component with user name and logout button
 *
 * @param currentUser Current user details
 * @param loginUpdate State function to update user info
 */
function UserLogout({ currentUser, loginUpdate }) {
  let history = useHistory();

  const logout = async () => {
    let csrfToken = getCookie("csrftoken");
    fetch("/api/logout/", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    })
      .then(() => {
        loginUpdate(null);
        history.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container fluid className="justify-content-end">
      <Row className="align-items-center">
        <Col className="text-right">
          {currentUser && currentUser["username"]}
        </Col>
        <Col md="auto" size="lg">
          <Button
            block
            type="submit"
            onClick={logout}
            variant="primary"
            size="sm"
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default UserLogout;
