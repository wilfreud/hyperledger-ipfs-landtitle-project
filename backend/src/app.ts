import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import landTitleRoutes from './routes/landTitleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger.js';

dotenv.config({ path: ".env" });

const app = express();
app.use(bodyParser.json());


// Generate Swagger spec
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Expose JSON docs
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


app.use('/api/landtitles', landTitleRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend for Land Title Management');
});

export default app;
