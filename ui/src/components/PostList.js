import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";

import PostListItem from "./PostListItem";

/**
 * Builds a list of card components with blog post info
 */
function PostList() {
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    fetch("api/blog/")
      .then((res) => res.json())
      .then((res) => {
        setPostList(res);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  let cardList;
  let listBody;

  if (postList.length !== 0) {
    cardList = postList.map((post) => (
      <PostListItem post={post} key={post.id} />
    ));
    listBody = <ul className="list-unstyled mb-0">{cardList}</ul>;
  }

  return (
    <Container className="pt-5">
      <Row>
        <Col lg={12}>{listBody}</Col>
      </Row>
    </Container>
  );
}

export default PostList;
