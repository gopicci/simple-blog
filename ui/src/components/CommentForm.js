import React from "react";
import { Formik } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";

import { getCookie } from "../services/AuthService";

import "react-quill/dist/quill.snow.css";

/**
 * Comment post form
 *
 * @param match Route info to extract slug
 * @param postedNewComment State function to indicate that a new comment has been posted
 */
function CommentForm({ match, postedNewComment }) {
  const onSubmit = async (
    values,
    { setSubmitting, setFieldError, setStatus, resetForm }
  ) => {
    const data = {
      body: values.body,
    };

    let csrfToken = getCookie("csrftoken");

    fetch(`/api/blog/${match.params.slug}/comments/`, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data: data })))
      .then((res) => {
        if (!res.ok) {
          for (const value in res.data) {
            setStatus({ success: false });
            setFieldError(value, res.data[value].join(" "));
          }
          throw Error(res.data.statusText);
        }
        resetForm();
        setStatus({ success: true });
        postedNewComment(true);
      })
      .catch((error) => {
        setStatus({ success: false });
        setSubmitting(false);
        console.error(error);
      });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialStatus={{
        success: false,
      }}
      initialValues={{
        body: "",
      }}
      onSubmit={onSubmit}
    >
      {({ status, errors, handleChange, handleSubmit, values }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="body">
            <Form.Label>Post comment:</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              className={
                "body" in errors
                  ? "is-invalid"
                  : status.success
                  ? "is-valid"
                  : ""
              }
              name="body"
              onChange={handleChange}
              value={values.body || ""}
              required
            />
            {"body" in errors && (
              <Form.Control.Feedback type="invalid">
                {errors.body}
              </Form.Control.Feedback>
            )}
            {status.success && (
              <Form.Control.Feedback type="valid">
                Comment posted
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <Button
                md="auto"
                className="post-button"
                type="submit"
                variant="primary"
              >
                Post
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}

export default CommentForm;
