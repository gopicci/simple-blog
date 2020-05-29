import React from 'react';
import { Formik } from 'formik';
import { Button, Container, Col, Form, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Login (props) {

  const onSubmit = async (values, actions) => {
    try {
      await props.login(
        values.email,
        values.password
      );
    }
    catch (error) {
      console.error(error);
    }
    finally {
      actions.setSubmitting(false);
    }
  }

  return (
    <Container fluid className='justify-content-end'>
      <Row>
        <Col>
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            onSubmit={onSubmit}
          >
            {({
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              values
              }) => (
              <Form inline noValidate onSubmit={handleSubmit}>
                    <Form.Control
                      name='email'
                      onChange={handleChange}
                      value={values.email}
                      placeholder='Email'
                      size='sm'
                    />
                    <Form.Control
                      name='password'
                      type='password'
                      onChange={handleChange}
                      value={values.password}
                      placeholder='password'
                      size='sm'
                    />
                    <Form.Group>
                    <Button
                      block
                      type='submit'
                      disabled={isSubmitting}
                      variant='primary'
                      size='sm'
                    >Login</Button>
                    </Form.Group>
              </Form>
            )}
          </Formik>
        </Col>
        <Col md='auto'>
          <LinkContainer to='/register' >
            <Button
              block
              type='submit'
              variant='primary'
              size='sm'
            >Register</Button>
          </LinkContainer>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;