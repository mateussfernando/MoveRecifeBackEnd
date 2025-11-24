// ...existing code...
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import UserModel from '../models/userModel';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
    async registerUser(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Name, email and password are required.' });
            }

            const existing = await UserModel.findOne({ email });
            if (existing) {
                return res.status(409).json({ message: 'User already exists.' });
            }

            const hashed = await bcrypt.hash(password, 10);
            const user = new UserModel({ name, email, password: hashed });
            await user.save();

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error('JWT_SECRET not defined');
                return res.status(500).json({ message: 'Server configuration error.' });
            }

            const token = jwt.sign(
                { id: user._id, email: user.email, name: user.name },
                secret,
                { expiresIn: '1d' }
            );

            return res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
        } catch (err: any) {
            console.error('registerUser error:', err);
            return res.status(500).json({ message: 'Registration failed.', error: err.message || err });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password required.' });
            }

            const user = await UserModel.findOne({ email });
            if (!user || !user.password) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error('JWT_SECRET not defined');
                return res.status(500).json({ message: 'Server configuration error.' });
            }

            const token = jwt.sign(
                { id: user._id, email: user.email, name: user.name },
                secret,
                { expiresIn: '1d' }
            );

            return res.status(200).json({ token, user: { id: user._id, email: user.email, name: user.name } });
        } catch (error: any) {
            console.error('login error:', error);
            return res.status(500).json({ message: 'Login failed.', error: error.message || error });
        }
    }

    async googleLogin(req: Request, res: Response) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ message: 'Google token required.' });
            }

            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload || !payload.email || !payload.sub) {
                return res.status(401).json({ message: 'Invalid Google token payload.' });
            }

            let user = await UserModel.findOne({ googleId: payload.sub });
            if (!user) {
                // If a user exists with same email but without googleId, link accounts
                user = await UserModel.findOne({ email: payload.email });
            }

            if (!user) {
                user = new UserModel({
                    name: payload.name || payload.email,
                    email: payload.email,
                    googleId: payload.sub,
                    password: '', // no local password
                });
                await user.save();
            } else if (!user.googleId) {
                // Link googleId if missing
                user.googleId = payload.sub;
                await user.save();
            }

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error('JWT_SECRET not defined');
                return res.status(500).json({ message: 'Server configuration error.' });
            }

            const jwtToken = jwt.sign(
                { id: user._id, email: user.email, name: user.name },
                secret,
                { expiresIn: '1d' }
            );

            return res.status(200).json({ token: jwtToken, user: { id: user._id, email: user.email, name: user.name } });
        } catch (err: any) {
            console.error('googleLogin error:', err);
            return res.status(500).json({ message: 'Google login failed.', error: err.message || err });
        }
    }
}

export default AuthController;
