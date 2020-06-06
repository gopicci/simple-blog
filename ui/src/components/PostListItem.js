import React from 'react';
import {Badge, Card, Col, Media} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import HTMLParser from 'fast-html-parser';

import { dateBuilder } from '../services/DateService';

import '../style/PostListItem.css'

function PostListItem ({author, title, slug, body, created, updated, tags}) {

  const href = `/${slug}`

  const content = HTMLParser.parse(body).rawText

  const tagList = tags.map(tag => <Badge key={tag} className='list-badge badge-primary'>{tag}</Badge>)

  return (
    <LinkContainer to={href} className='pointer-cursor'>
    <Card className='list-card mb-3' style='max-width: 20rem;'>
      <Card.Header className='text-muted'>{dateBuilder(author, created, updated)}</Card.Header>
      <Card.Body>
        <Card.Title className='list-card-title'><h3>{title}</h3></Card.Title>
        <Card.Text >
          <span className='list-card-text text-muted'>{content}</span>
        </Card.Text>
        <Card.Text className='text-right'>
          {tagList}
        </Card.Text >

      </Card.Body>
    </Card>
  </LinkContainer>
  );
}

export default PostListItem;