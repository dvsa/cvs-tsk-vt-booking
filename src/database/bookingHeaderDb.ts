import { dbConnection } from './dbConnection';
import { BookingHeader } from '../interfaces/BookingHeader';

export const bookingHeaderDb = {
  async insert(bookingHeader: BookingHeader): Promise<number> {
    const connection = await dbConnection();

    bookingHeader.BOOKING_HEADER_NO = connection.raw(
      'CvsBookingHeader.nextVal',
    );

    const results: BookingHeader[] = await connection
      .insert([bookingHeader], ['BOOKING_HEADER_NO'])
      .into('BOOKING_HEADER');

    if (results.length === 0) {
      throw new Error('Insert booking header failed. No data returned.');
    }

    return results[0].BOOKING_HEADER_NO;
  },
};
