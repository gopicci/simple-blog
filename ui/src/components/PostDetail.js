import React, {useEffect, useState} from 'react';
import {
  Button, Card, Container, Col, Row
} from 'react-bootstrap';
import DOMPurify from 'dompurify';

import { dateBuilder } from '../services/DateService';
import { getUser } from '../services/AuthService';
import {LinkContainer} from 'react-router-bootstrap';


function PostDetail ({ match }) {

  const [postDetail, setPostDetail] = useState({});

  const [dateString, setDateString] = useState('');

  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${match.params.slug}`)
      .then(res => res.json())
      .then(res => {
        setPostDetail(res);
        setDateString(dateBuilder(res['author'], res['created_on'], res['updated_on']));
        if (getUser().username == res['author'])
          setIsAuthor(true)
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  },[match.slug])


  const editLink = `/${match.params.slug}/edit`

  return (
    <Container className='pt-5'>

        <Col lg={12}>
          <Row className='align-items-center'>
            <Col><h1>{postDetail['title']}</h1></Col>
            {
              isAuthor &&
              <Col>
                <div className='text-right'>
                  <LinkContainer to={editLink}>
                    <Button size='sm'>Edit post</Button>
                  </LinkContainer>
                </div>
              </Col>
            }
          </Row>
          <Row>
            <Col><p className='text-muted'>{dateString}</p></Col>
          </Row>

          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(postDetail['body'])}} />
        </Col>

    </Container>
  )

}

export default PostDetail;