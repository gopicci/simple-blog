import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

function UserLogout (props) {

  return (
    <Container fluid className='justify-content-end'>
      <Row >
        <Col>
          {
            props.currentUser &&
              props.currentUser['username']
          }
        </Col>
        <Col md='auto' size='lg'>
            <Button
              block
              type='submit'
              onClick={props.logout}
              variant='primary'
              size='sm'
            >Logout</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default UserLogout;