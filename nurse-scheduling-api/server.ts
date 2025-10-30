import express from 'express';
import cors from 'cors';
import sequelize from './src/config/database';

// Import routes
import authRoutes from './src/routes/auth';
import shiftRoutes from './src/routes/shifts';
import leaveRoutes from './src/routes/leaves';

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', shiftRoutes);
app.use('/api', leaveRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Start server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err: any) => {
    console.error('Unable to connect to the database:', err);
});