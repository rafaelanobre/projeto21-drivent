import { Response } from 'express';
import httpStatus from 'http-status';
import { invalidDataError } from '@/errors';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotels = await hotelsService.getAllHotels(userId);
  return res.status(httpStatus.OK).send(hotels);
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const id = Number(req.params.hotelId);
  const { userId } = req;
  if (!id) return invalidDataError('invalid id');
  const hotels = await hotelsService.getHotelRooms(id, userId);
  return res.status(httpStatus.OK).send(hotels);
}
