import React from 'react';
import {Button, Card, Col, Media} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import DOMPurify from 'dompurify';

import { dateBuilder } from '../services/DateService';

import '../style/PostListItem.css'

function PostListItem ({author, title, slug, body, created, updated, tags}) {

  const href = `/${slug}`

  const tagList = tags.map(tag => <span className='list-badge badge badge-primary'>{tag}</span>)

  return (
    <LinkContainer to={href} className='pointer-cursor'>
    <Card className='list-card mb-3' style='max-width: 20rem;'>
      <Card.Header className='text-muted'>{dateBuilder(author, created, updated)}</Card.Header>
      <Card.Body>
        <Card.Title className='list-card-title'><h3>{title}</h3></Card.Title>
        <Card.Text>
          <div className='list-card-text text-muted' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body)}} />
          <p className='text-muted text-right'>{tagList}</p>
        </Card.Text>
      </Card.Body>
    </Card>
  </LinkContainer>
  );
}

export default PostListItem;