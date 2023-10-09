import faker from '@faker-js/faker';
import { Booking, Room, TicketStatus } from '@prisma/client';
import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';
import { bookingService } from '@/services';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Get booking by user', () => {
  it('should return error 404 if the user doesnt have a booking', async () => {
    const bookingMock = jest.spyOn(bookingRepository, 'getUserBooking').mockResolvedValueOnce(undefined);

    const booking = bookingService.getUserBooking(faker.datatype.number({ max: 200 }));

    expect(bookingMock).toBeCalledTimes(1);
    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return booking data', async () => {
    const mock = {
      id: faker.datatype.number({ max: 200 }),
      userId: 1,
      roomId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: 5,
        capacity: faker.datatype.number({ max: 10 }),
        hotelId: faker.datatype.number({ max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: faker.name.firstName(),
      },
    };
    const bookingMock = jest.spyOn(bookingRepository, 'getUserBooking').mockImplementationOnce((): any => {
      return mock;
    });

    const booking = await bookingService.getUserBooking(1);

    expect(booking).toEqual(mock);
    expect(bookingMock).toBeCalledTimes(1);
  });
});

describe('Create a new booking', () => {
  it('should return error 403 if ticket is not paid', async () => {
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.phone.phoneNumber('+55 ## 9####-####'),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.state(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.RESERVED,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobArea(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return mockEnrollment;
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
      return mockTicket;
    });

    const booking = bookingService.newBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Not allowed!',
    });
  });

  it('should return error 403 if ticket is remote', async () => {
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.phone.phoneNumber('+55 ## 9####-####'),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.state(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobArea(),
        price: 100,
        isRemote: true,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);

    const booking = bookingService.newBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Not allowed!',
    });
  });

  it('should return error 403 if ticket doesnt include hotel', async () => {
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.phone.phoneNumber('+55 ## 9####-####'),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.state(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobArea(),
        price: 100,
        isRemote: false,
        includesHotel: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);

    const booking = bookingService.newBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Not allowed!',
    });
  });

  it('should return error 404 if room id doesnt exists', async () => {
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.phone.phoneNumber('+55 ## 9####-####'),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.state(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobArea(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
    jest.spyOn(bookingRepository, 'checkRoomId').mockResolvedValueOnce(undefined);

    const booking = bookingService.newBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return error 403 if room hasnt free space', async () => {
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.phone.phoneNumber('+55 ## 9####-####'),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.state(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobArea(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    const mockRoom: Room & { Booking: Booking[] } = {
      id: 1,
      name: faker.commerce.productName(),
      capacity: 0,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [],
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
    jest.spyOn(bookingRepository, 'checkRoomId').mockResolvedValueOnce(mockRoom);

    const booking = bookingService.newBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Not allowed!',
    });
  });

  it('should create a new booking and return id', async () => {
    const mockEnrollment = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.phone.phoneNumber('+55 ## 9####-####'),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.state(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
    const mockTicket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobArea(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    const mockRoom: Room & { Booking: Booking[] } = {
      id: 1,
      name: faker.commerce.productName(),
      capacity: 10,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [],
    };
    const mockBooking = {
      id: 1,
      userId: mockEnrollment.userId,
      roomId: mockRoom.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: mockRoom.id,
        name: mockRoom.name,
        hotelId: mockRoom.hotelId,
        createdAt: mockRoom.createdAt,
        capacity: mockRoom.capacity,
        updatedAt: mockRoom.updatedAt,
      },
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
    jest.spyOn(bookingRepository, 'checkRoomId').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'newBooking').mockResolvedValueOnce(mockBooking);

    const booking = await bookingService.newBooking(1, 1);

    expect(booking).toEqual(mockBooking.id);
  });
});

describe('Update booking', () => {
  it('should return error 403 if user doesnt have a booking', async () => {
    jest.spyOn(bookingRepository, 'getUserBooking').mockResolvedValueOnce(undefined);

    const booking = bookingService.updateBooking(1, 1, 1);

    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Not allowed!',
    });
  });

  it('should return error 404 if room id doesnt exists', async () => {
    const mockBooking = {
      id: 1,
      userId: 1,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: 1,
        name: faker.commerce.productName(),
        hotelId: 1,
        createdAt: new Date(),
        capacity: 5,
        updatedAt: new Date(),
      },
    };

    jest.spyOn(bookingRepository, 'getUserBooking').mockResolvedValueOnce(mockBooking);
    jest.spyOn(bookingRepository, 'checkRoomId').mockResolvedValueOnce(undefined);

    const booking = bookingService.updateBooking(1, 1, 1);

    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return error 403 if room hasnt free space', async () => {
    const mockBooking = {
      id: 1,
      userId: 1,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: 1,
        name: faker.commerce.productName(),
        hotelId: 1,
        createdAt: new Date(),
        capacity: 1,
        updatedAt: new Date(),
      },
    };

    const mockRoom: Room & { Booking: Booking[] } = {
      id: 2,
      name: faker.commerce.productName(),
      capacity: 1,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [
        {
          id: 5,
          userId: 5,
          roomId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    jest.spyOn(bookingRepository, 'getUserBooking').mockResolvedValueOnce(mockBooking);
    jest.spyOn(bookingRepository, 'checkRoomId').mockResolvedValueOnce(mockRoom);

    const booking = bookingService.updateBooking(1, 1, 1);

    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Not allowed!',
    });
  });

  it('should update the booking and return id', async () => {
    const mockBooking = {
      id: 1,
      userId: 1,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: 1,
        name: faker.commerce.productName(),
        hotelId: 1,
        createdAt: new Date(),
        capacity: 1,
        updatedAt: new Date(),
      },
    };

    const mockRoom: Room & { Booking: Booking[] } = {
      id: 2,
      name: faker.commerce.productName(),
      capacity: 5,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [
        {
          id: 5,
          userId: 5,
          roomId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    jest.spyOn(bookingRepository, 'getUserBooking').mockResolvedValueOnce(mockBooking);
    jest.spyOn(bookingRepository, 'checkRoomId').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'updateBooking').mockResolvedValueOnce(mockBooking);

    const booking = await bookingService.updateBooking(1, 1, 1);

    expect(booking).toEqual(mockBooking.id);
  });
});
