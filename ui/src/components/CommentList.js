import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";

import CommentListItem from "./CommentListItem";

/**
 * Returns a list of comment items for the related post
 *
 * @param match Route info to extract slug
 * @param {bool} newComment Upper state to indicate if a new comment has been posted
 *                          since last fetching the list from the API
 * @param postedNewComment State function to update newComment
 */
function PostList({ match, newComment, postedNewComment }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    fetch(`/api/blog/${match.params.slug}/comments`)
      .then((res) => res.json())
      .then((res) => {
        setCommentList(res);
        postedNewComment(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [newComment, postedNewComment, match]);

  let cardList;
  let listBody;

  if (commentList.length !== 0) {
    cardList = commentList.map((comment) => (
      <CommentListItem
        author={comment.author}
        body={comment.body}
        key={comment.id}
        created={comment.created_on}
      />
    ));
    listBody = <ul className="list-unstyled mb-0">{cardList}</ul>;
  }

  return <ListGroup>{listBody}</ListGroup>;
}

export default PostList;
