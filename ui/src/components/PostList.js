import React, {useEffect, useState} from 'react';
import {
  Card, Container, Col, Row
} from 'react-bootstrap';

import PostListItem from './PostListItem';


function PostList (props) {

  const [postList, setPostList] = useState([]);

  useEffect(() => {
    fetch('api/blog/')
      .then(res => res.json())
      .then(res => {
        setPostList(res)
        console.log(res)
        return res
      })
      .catch((error) => {
        console.log(error);
      });
  },[])

  let cardList;
  let listBody;

  if (postList.length === 0) {
    console.log('no posts')
  } else {
    cardList = postList.map(post =>
      <PostListItem
        author={post.author}
        title={post.title}
        slug={post.slug}
        body={post.body}
        key={post.id}
        tags={post.tags}
        created={post.created_on}
        updated={post.updated_on}
      />
    )
    listBody = <ul className='list-unstyled mb-0'>{cardList}</ul>
  }

  return (
    <Container className='pt-5'>
      <Row>
        <Col lg={12}>
          {listBody}
        </Col>
      </Row>
    </Container>
  )

}

export default PostList;