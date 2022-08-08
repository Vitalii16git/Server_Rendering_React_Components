import React from 'react';
import express from 'express';
import { readFileSync } from 'fs';
import { renderToString } from 'react-dom/server';

import { App } from '../client/App';
import { handleModifyAnswerVotes } from '../shared/utility';

const data = {
  questions: [
    {
      questionId: 'Q1',
      content: 'Should we use Jquery or Fetch for Ajax?',
    },
    {
      questionId: 'Q2',
      content: 'What is the best feature of React?',
    },
  ],
  answers: [
    {
      answerId: 'A1',
      questionId: 'Q1',
      upvotes: 2,
      content: 'JQuery',
    },
    {
      answerId: 'A2',
      questionId: 'Q1',
      upvotes: 1,
      content: 'Fetch',
    },
    {
      answerId: 'A3',
      questionId: 'Q2',
      upvotes: 1,
      content: 'Performance',
    },
    {
      answerId: 'A4',
      questionId: 'Q2',
      upvotes: 3,
      content: 'Ease of use',
    },
  ],
};

const app = new express();

app.get('/data', async (_req, res) => {
  res.json(data);
});

app.use(express.static('dist'));

app.get('/vote/:answerId', (req, res) => {
  const { query, params } = req;
  data.answers = handleModifyAnswerVotes(
    data.answers,
    params.answerId,
    +query.increment
  );
  res.send('OK');
});

app.get('/', async (_req, res) => {
  const index = readFileSync(`public/index.html`, `utf8`);
  const rendered = renderToString(
    <App questions={data.questions} answers={data.answers} />
  );
  res.send(index.replace('{{rendered}}', rendered));
});

app.listen(7777);
console.info('server listening');
