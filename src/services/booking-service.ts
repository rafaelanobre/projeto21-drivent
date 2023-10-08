import { TicketStatus } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';

async function getUserBooking(userId: number) {
  const booking = await bookingRepository.getUserBooking(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function newBooking(userId: number, roomId: number) {
  await checkTicket(userId);
  await checkIfRoomHasSpace(roomId);

  const booking = await bookingRepository.newBooking(userId, roomId);

  return booking.id;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const userBooking = await bookingRepository.getUserBooking(userId);
  if (!userBooking || userBooking.id !== bookingId) throw forbiddenError();
  await checkIfRoomHasSpace(roomId);

  const booking = await bookingRepository.updateBooking(bookingId, roomId);

  return booking.id;
}

async function checkTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw forbiddenError();

  if (ticket.status !== TicketStatus.PAID || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
}

async function checkIfRoomHasSpace(roomId: number) {
  const room = await bookingRepository.checkRoomId(roomId);
  if (!room) throw notFoundError();
  if (room.capacity <= room.Booking.length) throw forbiddenError();
}

export const bookingService = {
  getUserBooking,
  newBooking,
  updateBooking,
};
