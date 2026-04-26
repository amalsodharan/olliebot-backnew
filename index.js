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

app.get('/api/me', authenticateToken, userController.userData);
app.post('/api/chat', authenticateToken, chatController.chatModule);    
app.post('/api/demo', chatController.chatModule);    

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}....`);
    });
}

export default app;