import { prisma } from "@/config";

async function getAllHotels() {
    const hotels = await prisma.hotel.findMany();

    return hotels;
}

async function getHotelRooms(id: number) {
    const rooms = await prisma.hotel.findUnique({
        where: { id },
        include: { Rooms: true },
    });

    return rooms;
}

export const hotelsRepository = {
    getAllHotels,
    getHotelRooms
};