import mongoose from 'mongoose';

export async function connectDB(uri: string): Promise<void> {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(uri, {
            // use options recomendadas
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // opcional: nome do DB explicitamente via env
            dbName: process.env.MONGODB_DB || undefined,
        } as mongoose.ConnectOptions);
        console.log('MongoDB conectado (mongoose).');
    } catch (err) {
        console.error('Erro ao conectar no MongoDB:', (err as Error).message || err);
        throw err;
    }
}

export function disconnectDB(): Promise<void> {
    return mongoose.disconnect();
}