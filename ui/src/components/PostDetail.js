import React, {useEffect, useState} from 'react';
import {
  Badge, Button, Container, Col, Row
} from 'react-bootstrap';
import DOMPurify from 'dompurify';
import { LinkContainer } from 'react-router-bootstrap';

import { dateBuilder } from '../services/DateService';
import CommentList from './CommentList'
import CommentForm from './CommentForm'


import '../style/PostDetail.css'


function PostDetail ({ match, currentUser }) {

  const [postDetail, setPostDetail] = useState({});

  const [dateString, setDateString] = useState('');

  const [isAuthor, setIsAuthor] = useState(false);

  const [tagList, setTagList] = useState([])

  const [newComment, setNewComment] = useState(false)

  const postedNewComment = (bool) => {
    setNewComment(bool);
  }

  useEffect(() => {
    fetch(`/api/blog/${match.params.slug}`)
      .then(res => res.json())
      .then(res => {
        setPostDetail(res);
        setDateString(dateBuilder(res['author'], res['created_on'], res['updated_on']));
        setTagList(res['tags'].map(tag => <Badge key={tag} className='list-badge badge badge-primary'>{tag}</Badge>))
        if (currentUser && currentUser['username'] === res['author'])
          setIsAuthor(true)
      })
      .catch((error) => {
        console.error(error);
      });
  },[match.slug])

  const editLink = `/${match.params.slug}/edit`

  return (
    <Container className='pt-5'>

        <Col lg={12}>
          <Row className='align-items-center'>
            <Col><h1 className='postTitle'>{postDetail['title']}</h1></Col>
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
          <Row>
            <Col><p className='text-muted'>Tags: {tagList}</p></Col>
          </Row>
          <Row>
            <Col><div className='postBody' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(postDetail['body'])}} /></Col>
          </Row>
          <Row className='comments'>
            <Col>
              <CommentList match={match} newComment={newComment} postedNewComment={postedNewComment} />
            </Col>
          </Row>
          <Row>
            <Col>
              <CommentForm match={match} newComment={newComment} postedNewComment={postedNewComment} />
            </Col>
          </Row>
        </Col>

    </Container>
  )

}

export default PostDetail;