import React from "react";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { getCookie } from "../services/AuthService";

/**
 * Login form
 *
 * @param loginUpdate State function to update user info
 */
function Login({ loginUpdate }) {
  let history = useHistory();

  const onSubmit = async (values, actions) => {
    let csrfToken = getCookie("csrftoken");
    fetch("/api/login/", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ email: values.email, password: values.password }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, body: data })))
      .then((res) => {
        actions.setSubmitting(false);

        // error handling
        if (!res.ok) {
          for (const value in res.body) {
            if (value === "email") {
              const errorMessage = res.body[value].join(" ");
              toast.error(`Email: ${errorMessage}`);
              actions.setFieldError(value, errorMessage);
            }
            if (value === "password") {
              const errorMessage = res.body[value].join(" ");
              toast.error(`Password: ${errorMessage}`);
              actions.setFieldError(value, errorMessage);
            }
            if (value === "non_field_errors") {
              const errorMessage = res.body[value].join(" ");
              toast.error(errorMessage);
              actions.setFieldError("email", errorMessage);
              actions.setFieldError("password", errorMessage);
            }
          }
          throw Error(res.body.statusText);
        } else {
          loginUpdate(res.body);
          history.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container fluid className="justify-content-end">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={onSubmit}
      >
        {({ errors, handleChange, handleSubmit, isSubmitting, values }) => (
          <Form inline noValidate onSubmit={handleSubmit}>
            <Form.Control
              className={"email" in errors ? "email is-invalid" : "email"}
              name="email"
              onChange={handleChange}
              value={values.email}
              placeholder="Email"
              size="sm"
            />
            <Form.Control
              className={"password" in errors ? "is-invalid" : ""}
              name="password"
              type="password"
              onChange={handleChange}
              value={values.password}
              placeholder="password"
              size="sm"
            />

            <Form.Group>
              <Button
                block
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                size="sm"
              >
                Login
              </Button>
            </Form.Group>
            <Form.Group>
              <LinkContainer to="/register">
                <Button
                  block
                  className="register-button"
                  variant="primary"
                  size="sm"
                >
                  Register
                </Button>
              </LinkContainer>
            </Form.Group>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default Login;
