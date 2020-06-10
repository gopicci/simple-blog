import React, { useState } from "react";
import { Formik } from "formik";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import { getCookie } from "../services/AuthService";

/**
 * Registration form
 */
function Register() {
  const [isSubmitted, setSubmitted] = useState(false);

  const onSubmit = async (values, actions) => {
    const data = {
      username: values.username,
      email: values.email,
      password1: values.password1,
      password2: values.password2,
    };

    let csrfToken = getCookie("csrftoken");
    fetch("api/register/", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, body: data })))
      .then((response) => {
        if (!response.ok) {
          for (const value in response.body) {
            if (value === "non_field_errors") {
              actions.setFieldError(
                "password2",
                response.body[value].join(" ")
              );
            }
            actions.setFieldError(value, response.body[value].join(" "));
          }
          throw Error(response.body.statusText);
        } else {
          setSubmitted(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isSubmitted) {
    return <Redirect to="/registered" />;
  }

  return (
    <Container className="pt-5">
      <Row>
        <Col lg={12}>
          <Card className="mb-3">
            <Card.Header>Register</Card.Header>
            <Card.Body>
              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  password1: "",
                  password2: "",
                }}
                onSubmit={onSubmit}
              >
                {({ errors, handleChange, handleSubmit, values }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="username">
                      <Form.Label>Username:</Form.Label>
                      <Form.Control
                        className={"username" in errors ? "is-invalid" : ""}
                        name="username"
                        onChange={handleChange}
                        values={values.username}
                        required
                      />
                      {"username" in errors && (
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group controlId="email">
                      <Form.Label>Email address:</Form.Label>
                      <Form.Control
                        className={"email" in errors ? "is-invalid" : ""}
                        name="email"
                        type="email"
                        onChange={handleChange}
                        values={values.email}
                        required
                      />
                      {"email" in errors && (
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group controlId="password1">
                      <Form.Label>Password:</Form.Label>
                      <Form.Control
                        className={"password1" in errors ? "is-invalid" : ""}
                        name="password1"
                        onChange={handleChange}
                        type="password"
                        values={values.lastName}
                      />
                      {"password1" in errors && (
                        <Form.Control.Feedback type="invalid">
                          {errors.password1}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group controlId="password2">
                      <Form.Label>Confirm password:</Form.Label>
                      <Form.Control
                        className={"password2" in errors ? "is-invalid" : ""}
                        name="password2"
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                      />
                      {"password2" in errors && (
                        <Form.Control.Feedback type="invalid">
                          {errors.password2}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Button block type="submit" variant="primary">
                      Register
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
