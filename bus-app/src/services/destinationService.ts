import axios from 'axios';

export class DestinationService {
    private googleApiKey = process.env.GOOGLE_MAPS_API_KEY;

    async fetchPopularDestinationsNearby(userLat: number, userLng: number, destinations: Array<{lat: number, lng: number, name: string}>) {
        const origins = `${userLat},${userLng}`;
        const destinationsStr = destinations.map(d => `${d.lat},${d.lng}`).join('|');
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinationsStr}&key=${this.googleApiKey}`;

        const response = await axios.get(url);
        const distances = response.data.rows[0].elements;

        // Filtra destinos até 5km
        return destinations.filter((dest, idx) => distances[idx].distance.value <= 5000);
    }
}