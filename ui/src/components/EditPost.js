import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import {
  Button, Card, Col, Container, Form, Row
} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import {getCookie} from '../services/AuthService';
import RichEditor from './RichEditor';
import TagInput from './TagInput';

function EditPost ({ match }) {

  const [postData, setPostData] = useState({
    title: '',
    tags: [],
    body: ''
  });

  useEffect(() => {
    let csrfToken = getCookie('csrftoken');
    fetch(`/api/blog/${match.params.slug}`)
      .then(res =>res.json())
      .then(res => {
          setPostData({
            title: res['title'],
            tags: res['tags'],
            body: res['body']
          });
        }
      )
      .catch((error) => {
        console.log(error);
      });
  },[])

  useEffect(() => {
    console.log(postData)
  },[postData])


    const onSubmit = async (values, actions) => {
    const data = {
      title: values.title,
      body: values.body,
      tags: values.tags
    }

    console.log(data)

    let csrfToken = getCookie('csrftoken');
    fetch('api/blog/', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify(data)
      }).then((res) => res.json().then(data => ({ok: res.ok, body: data})))
        .then((res) => {
        if (!res.ok) {
            console.log(res);
            for (const value in res.body) {
              actions.setFieldError(value, res.body[value].join(' '));
            }
            throw Error(res.body.statusText);
        }
        return res;
      }).then((res) => {
          setUrl(`/${res.body['slug']}`)
          setSubmitted(true);
      }).catch((error) => {
          actions.setSubmitting(false);
          console.log(error);
      });
    };

  return (
    <Container className='pt-5'>
    <Row>
      <Col lg={12}>
        <Card className='mb-3'>
          <Card.Header>Create post</Card.Header>
          <Card.Body>
            <Formik
              enableReinitialize={true}
              initialValues={postData}
              onSubmit={onSubmit}
            >
              {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                values,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId='title'>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                      className={ 'title' in errors ? 'is-invalid' : '' }
                      id='title'
                      name='title'
                      type='text'
                      onChange={handleChange}
                      values={values.title}
                      placeholder={values.title}
                      required
                    />
                    {
                      'title' in errors &&
                      <Form.Control.Feedback type='invalid'>{ errors.title }</Form.Control.Feedback>
                    }
                  </Form.Group>
                  <Form.Group controlId='tags'>
                    <Form.Label>Tags:</Form.Label>
                    <Field name='tags'>
                      {({
                        field,
                        form
                      }) => (
                        <TagInput
                          value={field.value}
                          onChange={field.onChange(field.name)}
                          {...form}
                        />
                      )}
                    </Field>
                    {
                        'tags' in errors &&
                        <Form.Control.Feedback type='invalid'>{ errors.title }</Form.Control.Feedback>
                    }
                  </Form.Group>
                  <Form.Group controlId='body'>
                    <Form.Label>Post:</Form.Label>
                    <Field name='body'>
                      {({ field }) => <RichEditor className='form-control' value={field.value} onChange={field.onChange(field.name)} />}
                    </Field>
                    {
                        'body' in errors &&
                        <Form.Control.Feedback type='invalid'>{ errors.title }</Form.Control.Feedback>
                    }
                  </Form.Group>
                  <Row className="justify-content-md-center">
                    <Col md="auto">
                      <Button md="auto" className='post-button' type='submit' variant='primary'>Post</Button>
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