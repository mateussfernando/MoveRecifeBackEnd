export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Optional for Google login
}

export interface Destination {
    id: string;
    name: string;
    description: string;
    location: {
        latitude: number;
        longitude: number;
    };
}