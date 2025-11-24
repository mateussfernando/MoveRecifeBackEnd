import express from 'express';
import AuthController from '../controllers/authController';

const router = express.Router();
const authController = new AuthController();


router.post('/register', authController.registerUser.bind(authController));
router.post('/login', authController.login.bind(authController));

router.post('/google', authController.googleLogin.bind(authController));

export function setAuthRoutes(app: express.Application) {
    app.use('/auth', router);
}