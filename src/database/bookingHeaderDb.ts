import logger from '../util/logger';
import { dbConnection } from './dbConnection';
import { BookingHeader } from '../interfaces/BookingHeader';
import { VtBooking } from '../interfaces/VtBooking';

export const bookingHeaderDb = {
  async insert(vtBooking: VtBooking): Promise<number> {
    logger.info('bookingHeader insert starting');
    const connection = await dbConnection();

    const bookingHeader = {
      ...new BookingHeader(),
      NAME0: vtBooking.name.substring(0, 50),
      BOOKING_HEADER_NO: connection.raw('CvsBookingHeader.nextVal'),
      DATE_MADE: connection.raw("sysdate - interval '10' day"),
      TIMESTAMP0: connection.raw('sysdate'),
    };

    const results: BookingHeader[] = await connection
      .insert([bookingHeader], ['BOOKING_HEADER_NO'])
      .into('BOOKING_HEADER');

    if (results.length === 0) {
      throw new Error('Insert booking header failed. No data returned.');
    }

    return results[0].BOOKING_HEADER_NO;
  },
};
