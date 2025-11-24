// import { Request, Response } from 'express';
// import { DestinationService } from '../services/destinationService';

// export class DestinationController {
//     constructor(private destinationService: DestinationService) {}

//     async getPopularDestinations(req: Request, res: Response): Promise<void> {
//         try {
//             const { lat, lng } = req.query;
//             if (!lat || !lng) {
//                 return res.status(400).json({ message: 'Latitude and longitude are required.' });
//             }

//             // Exemplo: destinos populares podem vir de um banco ou arquivo
//             const allDestinations = await this.destinationService.fetchPopularDestinationsNearby();

//             const nearbyDestinations = await this.destinationService.fetchPopularDestinationsNearby(
//                 Number(lat),
//                 Number(lng),
//                 allDestinations
//             );

//             res.status(200).json(nearbyDestinations);
//         } catch (error: any) {
//             res.status(500).json({ message: 'Error fetching popular destinations', error: error.message });
//         }
//     }
// }