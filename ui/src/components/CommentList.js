import React, {useEffect, useState} from 'react';
import {
  Container, Col, ListGroup, Row
} from 'react-bootstrap';

import CommentListItem from './CommentListItem';

function PostList ({ match, newComment, postedNewComment }) {

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    fetch(`/api/blog/${match.params.slug}/comments`)
      .then(res => res.json())
      .then(res => {
        setCommentList(res)
        postedNewComment(false)
      })
      .catch((error) => {
        console.error(error);
      });
  },[newComment])

  let cardList;
  let listBody;

  if (commentList.length !== 0) {
    cardList = commentList.map(comment =>
      <CommentListItem
        author={comment.author}
        body={comment.body}
        key={comment.id}
        created={comment.created_on}
      />
    )
    listBody = <ul className='list-unstyled mb-0'>{cardList}</ul>
  }

  return (
    <ListGroup>{listBody}</ListGroup>
  )

}

export default PostList;