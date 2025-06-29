import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initRoutes from './routes';


// Initialize Express app
const app: express.Application = express();
const PORT: number = 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
initRoutes(app);
app.use(bodyParser.json());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
