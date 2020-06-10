import React from "react";
import { ListGroupItem } from "react-bootstrap";

import { dateBuilder } from "../services/DateService";

import "../style/PostListItem.css";

/**
 * Item containing a single comment details
 */
function CommentListItem({ author, body, created }) {
  return (
    <ListGroupItem>
      <p>
        <small className="text-muted text-right">
          {dateBuilder(author, created, created)}
        </small>
      </p>
      <p className="commentBody">{body}</p>
    </ListGroupItem>
  );
}

export default CommentListItem;
