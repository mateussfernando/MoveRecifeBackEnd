import { Router } from 'express';
import { IotController } from '../controllers/iotController';

const router = Router();
const iotController = new IotController();

export function setIotRoutes(app) {
    app.use('/api/iot', router);
    router.get('/weather', iotController.getWeatherData.bind(iotController));
}