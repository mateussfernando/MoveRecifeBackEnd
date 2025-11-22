export class IotController {
    private thingspeakService: any;

    constructor(thingspeakService: any) {
        this.thingspeakService = thingspeakService;
    }

    public async getWeatherData(req: any, res: any): Promise<void> {
        try {
            const weatherData = await this.thingspeakService.getWeatherData();
            res.status(200).json(weatherData);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving weather data', error });
        }
    }
}