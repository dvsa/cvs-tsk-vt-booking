import { dbConnection } from './dbConnection';
import { VehicleBooking } from '../interfaces/VehicleBooking';
import { VtBooking } from '../interfaces/VtBooking';

export const vehicleBookingDb = {
  async insert(vehicleBooking: VehicleBooking): Promise<void> {
    const connection = await dbConnection();

    const results: VehicleBooking[] = await connection
      .insert([vehicleBooking], ['FK_BKGHDR_NO'])
      .into('VEHICLE_BOOKING');

    if (results.length === 0) {
      throw new Error('Insert vehicle booking failed. No data inserted.');
    }
  },

  async get(vtBooking: VtBooking): Promise<VehicleBooking[]> {
    const connection = await dbConnection();

    return connection
      .select()
      .from<VehicleBooking>('VEHICLE_BOOKING')
      .where('VRM', vtBooking.vrm)
      .andWhere('FK_LANTBD_DATE', new Date(vtBooking.testDate))
      .andWhere('FK_APPTYP_APPL_TYP', vtBooking.testCode);
  },
};
