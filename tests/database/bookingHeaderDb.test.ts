import { BookingHeader } from '../../src/interfaces/BookingHeader';
import { bookingHeaderDb } from '../../src/database/bookingHeaderDb';
import { knex, Knex } from 'knex';
import { mocked } from 'ts-jest/utils';
import { psvVtBooking } from '../resources/mVtBookings';

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

const bookingHeader = {
  ...new BookingHeader(),
  NAME0: psvVtBooking.name.substring(0, 50),
  BOOKING_HEADER_NO: null,
  DATE_MADE: null,
  TIMESTAMP0: null,
};

describe('bookingHeaderDb functions', () => {
  it('GIVEN everything is okay WHEN the data is inserted THEN the objects are mapped correctly and BOOKING_HEADER_NO is returned.', async () => {
    const bookingHeaderNo = await bookingHeaderDb.insert(psvVtBooking);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.insert).toBeCalledWith([bookingHeader], ['BOOKING_HEADER_NO']);
    expect(bookingHeaderNo).toEqual(54321);
  });

  it('GIVEN an issue with the insert WHEN no results are returned THEN an error is thrown.', async () => {
    await expect(bookingHeaderDb.insert(psvVtBooking)).rejects.toThrow(
      'Insert booking header failed. No data returned.',
    );
  });
});
