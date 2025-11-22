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
            if (!email || !password || !name) {
                return res.status(400).json({ message: 'Name, email and password required.' });
            }

            // Check if user exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists.' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user
            const user = new UserModel({ name, email, password: hashedPassword });
            await user.save();

            // Generate JWT
            const token = jwt.sign(
                { id: user._id, email: user.email, name: user.name },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '1d' }
            );

            res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
        } catch (error) {
            res.status(500).json({ message: 'Registration failed.' });
        }
    }

    async googleLogin(req: Request, res: Response) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ message: 'Google token required.' });
            }

            // Verify Google token
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();

            if (!payload) {
                return res.status(401).json({ message: 'Invalid Google token.' });
            }

            // Find or create user
            let user = await UserModel.findOne({ googleId: payload.sub });
            if (!user) {
                user = new UserModel({
                    name: payload.name,
                    email: payload.email,
                    googleId: payload.sub,
                    password: '', // No password for Google users
                });
                await user.save();
            }

            // Generate JWT
            const jwtToken = jwt.sign(
                { id: user._id, email: user.email, name: user.name },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '1d' }
            );

            res.status(200).json({ token: jwtToken, user: { id: user._id, email: user.email, name: user.name } });
        } catch (error) {
            res.status(500).json({ message: 'Google login failed.' });
        }
    }
}

export default AuthController;