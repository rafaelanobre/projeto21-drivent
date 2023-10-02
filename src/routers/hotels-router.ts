import { Router } from 'express';
import { getAllHotels, getHotelRooms } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.get('/', authenticateToken, getAllHotels);
hotelsRouter.get('/:hotelId', authenticateToken, getHotelRooms);

export { hotelsRouter };
