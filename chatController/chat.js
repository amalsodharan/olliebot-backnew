import dotenv from 'dotenv';
import getChatGPTResponse from './chatResponce.js';

dotenv.config();

const chatModule = async (req, res) => {
    try {
        const input = req.body.input;
        const chatStatus = req.body.chatStatus;
        if (!input || input.trim() === '') {
        return res.status(400).json({ error: 'Prompt is empty' });
        }

        console.log(`[Prompt received]: ${input}`);
        const answerHTML = await getChatGPTResponse(input, chatStatus);
        res.json({ answer: answerHTML });
    } catch (error){
        console.error(error);
        res.status(400).json({ message: 'Failed to process the request' });
    }
};

export default { chatModule };