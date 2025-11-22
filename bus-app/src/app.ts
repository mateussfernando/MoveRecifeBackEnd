import express from 'express';
import bodyParser from 'body-parser';
import { setAuthRoutes } from './routes/authRoutes';
import { setDestinationRoutes } from './routes/destinationRoutes';
import { setIotRoutes } from './routes/iotRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setAuthRoutes(app);
setDestinationRoutes(app);
setIotRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});