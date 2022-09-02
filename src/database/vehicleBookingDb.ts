import { dbConnection } from './dbConnection';
import { VehicleBooking } from '../interfaces/VehicleBooking';

export const vehicleBookingDb = {
  async insert(vehicleBooking: VehicleBooking): Promise<void> {
    const connection = await dbConnection();

    vehicleBooking.FK_BKGHDR_NO = connection.raw(
      "COALESCE((SELECT MAX(FK_BKGHDR_NO) + 1 from VEHICLE_BOOKING where FK_BKGHDR_USER_NO = 'XR'), 1)",
    );

    const insertResult: string[] = await connection
      .insert([vehicleBooking], ['FK_BKGHDR_NO'])
      .into('VEHICLE_BOOKING');

    if (insertResult.length === 0) {
      throw new Error('Insert failed. No data returned.');
    }
  },
};
