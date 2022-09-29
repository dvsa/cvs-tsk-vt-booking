import { knex, Knex } from 'knex';
import { mocked } from 'ts-jest/utils';
import { BookingHeader } from '../../src/interfaces/BookingHeader';
import { bookingHeaderDb } from '../../src/database/bookingHeaderDb';
import { VtBooking } from '../../src/interfaces/VtBooking';

jest.mock('knex');
const mknex = mocked(knex, true);
const mKnex = {
  insert: jest.fn().mockReturnThis(),
  into: jest
    .fn()
    .mockImplementationOnce(() => [{ BOOKING_HEADER_NO: 54321 }])
    .mockImplementationOnce(() => []),
  raw: jest.fn(() => null),
} as unknown as Knex;

mknex.mockImplementationOnce(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => mKnex,
);

const vtBooking: VtBooking = {
  name: 'Bobs ATF',
  bookingDate: '2022-08-10 10:00:00',
  vrm: 'AB12CDE',
  testCode: 'AAV',
  testDate: '2022-08-15 00:00:00',
  pNumber: 'P12345',
};

const bookingHeader = {
  ...new BookingHeader(),
  NAME0: vtBooking.name.substring(0, 50),
};

describe('bookingHeaderDb functions', () => {
  it('GIVEN everything is okay WHEN the data is inserted THEN the objects are mapped correctly and BOOKING_HEADER_NO is returned.', async () => {
    await bookingHeaderDb.insert(bookingHeader);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.insert).toBeCalledWith([bookingHeader], ['BOOKING_HEADER_NO']);
  });

  it('GIVEN an issue with the insert WHEN no results are returned THEN an error is thrown.', async () => {
    await expect(bookingHeaderDb.insert(bookingHeader)).rejects.toThrow(
      'Insert booking header failed. No data returned.',
    );
  });
});
