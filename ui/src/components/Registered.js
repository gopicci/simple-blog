import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

/**
 * Container displaying a successful registration message
 */
function Registered() {
  return (
    <Container className="pt-5">
      <Row>
        <Col lg={12}>
          <Card className="mb-3 text-center">
            <Card.Body>
              <h5>Registration successful</h5>
              <p>You can now login.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Registered;
