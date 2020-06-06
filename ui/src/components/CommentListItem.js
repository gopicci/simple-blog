import React from 'react';
import {Badge, Card, Col, ListGroupItem, Media} from 'react-bootstrap';

import { dateBuilder } from '../services/DateService';

import '../style/PostListItem.css'

function CommentListItem ({author, body, created}) {

  return (
    <ListGroupItem>
      <p><small className='text-muted text-right'>{dateBuilder(author, created, created)}</small></p>
      <p className='commentBody'>{body}</p>
    </ListGroupItem>
  );
}

export default CommentListItem;