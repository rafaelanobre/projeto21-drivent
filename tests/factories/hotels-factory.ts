import { prisma } from "@/config";
import faker from '@faker-js/faker';

export async function createHotel() {
    return prisma.hotel.create({
        data: {
            name: faker.name.findName('Hotel'),
            image: faker.internet.url(),
            updatedAt: new Date()
        },
    });
}