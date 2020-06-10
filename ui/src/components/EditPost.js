import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Redirect, useHistory } from "react-router-dom";

import { getCookie } from "../services/AuthService";
import RichEditor from "./RichEditor";
import TagInput from "./TagInput";

import "react-quill/dist/quill.snow.css";

/**
 * Component containing form for editing a blog post.
 *
 * @param match Route info to extract slug
 * @param currentUser Current logged in user info
 */
function EditPost({ match, currentUser }) {
  let history = useHistory();

  const [isSubmitted, setSubmitted] = useState(false);

  const [url, setUrl] = useState("/");

  const [postData, setPostData] = useState({
    title: "",
    tags: [],
    body: "",
  });

  useEffect(() => {
    fetch(`/api/blog/${match.params.slug}`)
      .then((res) => res.json())
      .then((res) => {
        if (currentUser["username"] !== res["author"]) history.push(url);
        setPostData({
          title: res["title"],
          tags: res["tags"],
          body: res["body"],
        });
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUser, history, match, url]);

  const onSubmit = async (values, actions) => {
    const data = {
      title: values.title,
      body: values.body,
      tags: values.tags,
    };

    let csrfToken = getCookie("csrftoken");
    fetch(`/api/blog/${match.params.slug}/`, {
      method: "put",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, body: data })))
      .then((res) => {
        if (!res.ok) {
          for (const value in res.body) {
            actions.setFieldError(value, res.body[value].join(" "));
          }
          throw Error(res.body.statusText);
        }
        return res;
      })
      .then((res) => {
        setUrl(`/${res.body["slug"]}`);
        setSubmitted(true);
      })
      .catch((error) => {
        actions.setSubmitting(false);
        console.error(error);
      });
  };

  if (isSubmitted) {
    return <Redirect to={url} />;
  }

  return (
    <Container className="pt-5">
      <Row>
        <Col lg={12}>
          <Card className="mb-3">
            <Card.Header>Edit post</Card.Header>
            <Card.Body>
              <Formik
                enableReinitialize={true}
                initialValues={postData}
                onSubmit={onSubmit}
              >
                {({ errors, handleChange, handleSubmit, values }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                      <Form.Label>Title:</Form.Label>
                      <Form.Control
                        className={"title" in errors ? "is-invalid" : ""}
                        name="title"
                        type="text"
                        onChange={handleChange}
                        value={values.title}
                        required
                      />
                      {"title" in errors && (
                        <Form.Control.Feedback type="invalid">
                          {errors.title}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group controlId="formTags">
                      <Form.Label>Tags:</Form.Label>
                      <Field name="tags">
                        {({ field, form }) => (
                          <TagInput
                            value={field.value}
                            onChange={field.onChange(field.name)}
                            {...form}
                          />
                        )}
                      </Field>
                      {"tags" in errors && (
                        <Form.Control.Feedback type="invalid">
                          {errors.title}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group controlId="body">
                      <Form.Label>Post:</Form.Label>
                      <Field name="body">
                        {({ field }) => (
                          <RichEditor
                            className="form-control"
                            value={field.value}
                            onChange={field.onChange(field.name)}
                          />
                        )}
                      </Field>
                      {"body" in errors && (
                        <Form.Control.Feedback type="invalid">
                          {errors.title}
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
                          Edit post
                        </Button>
                      </Col>
                    </Row>
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
export default EditPost;
