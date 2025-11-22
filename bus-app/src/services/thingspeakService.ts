export class ThingspeakService {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = 'YOUR_THINGSPEAK_API_KEY'; // Replace with your actual Thingspeak API key
        this.baseUrl = 'https://api.thingspeak.com/channels/YOUR_CHANNEL_ID/feed.json'; // Replace with your actual channel ID
    }

    public async getWeatherData(): Promise<{ temperature: number; humidity: number }> {
        try {
            const response = await fetch(`${this.baseUrl}?api_key=${this.apiKey}&results=1`);
            const data = await response.json();
            const latestEntry = data.feeds[0];

            return {
                temperature: latestEntry.field1, // Assuming field1 is temperature
                humidity: latestEntry.field2 // Assuming field2 is humidity
            };
        } catch (error) {
            throw new Error('Error fetching weather data from Thingspeak: ');
        }
    }
}