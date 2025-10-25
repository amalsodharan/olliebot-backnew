import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userController from './controllers/userController.js';
import authenticateToken from './middleware/Auth.js';
import chatController from './chatController/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message : 'This is a sample api' });
});

app.post('/api/signUp', userController.newUser);
app.post('/api/login', userController.login);

app.post('/api/chat', authenticateToken, chatController.chatModule)

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}....`);
})