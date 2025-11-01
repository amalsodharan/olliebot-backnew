import initDB from '../db.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

const SALT_ROUNDS = 10;

const newUser = async (req, res) => {
    const { Users } = await initDB();
    const { role, name, email, password } = req.body;
    if(!role || !name || !email || !password) res.status(400).json({ message : 'All fields are required' });
    try {
        const userFetch = await Users.findOne({ where: { email : email } });
        if(userFetch) res.status(400).json({ message : 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const input = { role, name, email, password: hashedPassword, is_deleted: false };
        const user = await Users.create(input);
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );
        res.status(201).json({ user: user, token: `JWT ${token}` })
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: 'Error creating new user!' })
    }
};

const login = async (req, res) => {
    const { Users } = await initDB();
    const { email, password } = req.body;
    if(!email || !password) res.status(400).json({ message : 'All fields are required' });
    try {
        const userFetch = await Users.findOne({ where: { email : email } });
        if(!userFetch) res.status(400).json({ message : 'user not found' });

        const isMatch = await bcrypt.compare(password, userFetch.password);
        if (!isMatch) return res.status(400).json({ message: 'wrong password' });
        const token = jwt.sign(
            { id: userFetch.id, role: userFetch.role, email: userFetch.email },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );
        res.status(201).json({ message: 'login successfull!', token: `JWT ${token}` });
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: 'Error logging in!' });
    }
};

const userData = async (req, res) => {
    try {
        const { Users } = await initDB();
        const userId = req.user.id;
        const userFetch = await Users.findOne({ where: { id : userId } });
        if(!userFetch) res.status(400).json({ message : 'user not found' });
        userFetch.password = undefined; 

        res.status(200).json({ userFetch });
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: 'Error fetching details' });
    }
};

export default { newUser, login, userData };