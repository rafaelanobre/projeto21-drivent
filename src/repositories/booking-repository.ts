import { prisma } from '@/config';

async function getUserBooking(userId: number) {
  return prisma.booking.findUnique({
    where: { userId },
    include: { Room: true },
  });
}

async function newBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId },
    include: { Room: true },
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
    include: { Room: true },
  });
}

async function checkRoomId(roomId: number) {
  return prisma.room.findUnique({
    where: { id: roomId },
    include: { Booking: true },
  });
}

export const bookingRepository = {
  getUserBooking,
  newBooking,
  updateBooking,
  checkRoomId,
};
