# Bus Application

This is a bus application that allows users to register, log in using Google, fetch popular destinations in the region, and retrieve weather data from an IoT device connected to the Thingspeak API.

## Features

- User registration
- Google login
- Fetch popular destinations
- Retrieve temperature and humidity data from IoT devices

## Project Structure

```
bus-app
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── authController.ts
│   │   ├── destinationController.ts
│   │   └── iotController.ts
│   ├── routes
│   │   ├── authRoutes.ts
│   │   ├── destinationRoutes.ts
│   │   └── iotRoutes.ts
│   ├── services
│   │   ├── googleAuthService.ts
│   │   ├── destinationService.ts
│   │   └── thingspeakService.ts
│   ├── models
│   │   └── userModel.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd bus-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. Access the application at `http://localhost:3000`.

## API Endpoints

- **User Registration**: `POST /api/auth/register`
- **Google Login**: `POST /api/auth/google`
- **Fetch Popular Destinations**: `GET /api/destinations/popular`
- **Get Weather Data**: `GET /api/iot/weather`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.