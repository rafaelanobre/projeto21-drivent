import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services/booking-service';

export async function getUserBooking(req: AuthenticatedRequest, res: Response) {
  const booking = await bookingService.getUserBooking(req.userId);
  return res.status(httpStatus.OK).send(booking);
}

export async function newBooking(req: AuthenticatedRequest, res: Response) {
  const bookingId = await bookingService.newBooking(req.userId, req.body.roomId);

  return res.status(httpStatus.OK).send({ bookingId });
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const bookingId = await bookingService.updateBooking(req.userId, req.body.roomId, parseInt(req.params.bookingId));

  return res.status(httpStatus.OK).send({ bookingId });
}
