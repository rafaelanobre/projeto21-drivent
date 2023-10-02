import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName('Hotel'),
      image: faker.internet.url(),
      updatedAt: new Date(),
    },
  });
}
