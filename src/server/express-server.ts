import express from 'express';
import cors from 'cors';
import { visitorRouter } from '../routes/visitors';
import { initializeDatabase } from '../db';

const app = express();
const port = process.env.VISITOR_PORT || 3002;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Screen-Resolution', 'X-Timezone', 'X-Platform'],
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'visitor-tracking'
  });
});

// Routes
app.use('/api/visitors', visitorRouter);

// Start server
app.listen(port, () => {
  console.log(`🔍 Visitor tracking server running on http://localhost:${port}`);
});

export default app;
