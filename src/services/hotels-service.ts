import { notFoundError, paymentRequiredError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { hotelsRepository } from '@/repositories/hotels-repository';

async function getAllHotels(userId: number) {
  await searchEnrollmentAndTicket(userId);

  const hotels = await hotelsRepository.getAllHotels();
  if (!hotels || hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelRooms(id: number, userId: number) {
  await searchEnrollmentAndTicket(userId);

  const hotels = await hotelsRepository.getAllHotels();
  if (!hotels || hotels.length === 0) throw notFoundError();

  const hotelRooms = await hotelsRepository.getHotelRooms(id);
  return hotelRooms;
}

async function searchEnrollmentAndTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (
    ticket.status === 'RESERVED' ||
    ticket.TicketType.isRemote === true ||
    ticket.TicketType.includesHotel === false
  ) {
    throw paymentRequiredError();
  }
}

export const hotelsService = {
  getAllHotels,
  getHotelRooms,
};
