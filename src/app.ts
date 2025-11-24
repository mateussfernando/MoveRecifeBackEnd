// ...existing code...
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { setAuthRoutes } from './routes/authRoutes';
// import { setDestinationRoutes } from './routes/destinationRoutes';
// import { setIotRoutes } from './routes/iotRoutes';
import { connectDB, disconnectDB } from './config/database';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


setAuthRoutes(app);
// setDestinationRoutes(app);
// setIotRoutes(app);

let server: ReturnType<typeof app.listen> | null = null;

async function start() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI não definido no .env');
            process.exit(1);
        }

        await connectDB(mongoUri);

        server = app.listen(PORT, () => {
            console.log(`Server está rodando na porta: ${PORT}`);
        });
    } catch (err: any) {
        console.error('Falha ao iniciar aplicação:', err.message || err);
        process.exit(1);
    }
}

start();

//
async function gracefulShutdown() {
    console.log('Shutting down...');
    try {
        if (server) {
            server.close(() => {
                console.log('HTTP server closed.');
            });
        }
        await disconnectDB();
        console.log('Disconnected from MongoDB.');
    } catch (err) {
        console.error('Erro no shutdown:', err);
    } finally {
        process.exit(0);
    }
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
