import { dbConnection } from './dbConnection';
import { VehicleBooking } from '../interfaces/VehicleBooking';
import { VtBooking } from '../interfaces/VtBooking';

export const vehicleBookingDb = {
  async insert(vehicleBooking: VehicleBooking): Promise<void> {
    const connection = await dbConnection();

    vehicleBooking.FK_BKGHDR_NO = connection.raw(
      "COALESCE((SELECT MAX(FK_BKGHDR_NO) + 1 from VEHICLE_BOOKING where FK_BKGHDR_USER_NO = 'XR'), 1)",
    );

    const results: string[] = await connection
      .insert([vehicleBooking], ['FK_BKGHDR_NO'])
      .into('VEHICLE_BOOKING');

    if (results.length === 0) {
      throw new Error('Insert failed. No data returned.');
    }
  },

  async get(vtBooking: VtBooking): Promise<VehicleBooking[]> {
    const connection = await dbConnection();

    const results: VehicleBooking[] = await connection
      .select()
      .from<VehicleBooking>('VEHICLE_BOOKING')
      .where('VRM', vtBooking.vrm)
      .andWhere('FK_LANTBD_DATE', new Date(vtBooking.testDate))
      .andWhere('FK_APPTYP_APPL_TYP', vtBooking.testCode);

    return results;
  },
};
