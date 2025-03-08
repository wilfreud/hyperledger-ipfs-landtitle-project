import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import landTitleRoutes from './routes/landTitleRoutes.js';

dotenv.config({ path: ".env" });

const app = express();
app.use(bodyParser.json());

app.use('/api/landtitles', landTitleRoutes);

app.get('/', (req, res) => {
  res.send('Backend for Land Title Management');
});

export default app;
