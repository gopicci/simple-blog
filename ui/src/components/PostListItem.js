import React from "react";
import { Badge, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import HTMLParser from "fast-html-parser";

import { dateBuilder } from "../services/DateService";
import LinesEllipsis from 'react-lines-ellipsis'

import "../style/PostListItem.css";

/**
 * Returns a card with post info for the post list
 *
 * @param {json} post Single blog post API response content
 */
function PostListItem({ post }) {
  const href = `/${post["slug"]}`;

  const content = HTMLParser.parse(post["body"]).rawText;

  const tagList = post["tags"].map((tag) => (
    <Badge key={tag} className="list-badge badge-primary">
      {tag}
    </Badge>
  ));

  return (
    <LinkContainer to={href} className="pointer-cursor">
      <Card className="list-card mb-3">
        <Card.Header className="text-muted">
          {dateBuilder(post["author"], post["created_on"], post["updated_on"])}
        </Card.Header>
        <Card.Body>
          <Card.Title className="list-card-title">
            <h3>{post["title"]}</h3>
          </Card.Title>
          <Card.Text>
            <span className="list-card-text text-muted">
              <LinesEllipsis
                text={content}
                maxLine="1"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </span>
          </Card.Text>
          <Card.Text className="text-right">{tagList}</Card.Text>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
}

export default PostListItem;
