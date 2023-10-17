import express from 'express';

const app = express();

app.get('/', (_, res) => {
  res.send('Hello, TypeScript Express Server!');
});

export default app;