import logger from '../util/logger';
import { dbConnection } from './dbConnection';
import { Knex } from 'knex';
import { VehicleBooking } from '../interfaces/VehicleBooking';
import { VtBooking } from '../interfaces/VtBooking';

export const insertVtBooking = async function (
  booking: VtBooking,
): Promise<string[]> {
  logger.info('insertVtBooking starting');

  const vehicleBooking = new VehicleBooking();
  vehicleBooking.SHORT_NAME = booking.name;
  vehicleBooking.VEHICLE_CLASS = 'V';
  vehicleBooking.NO_OF_AXLES = 2;
  vehicleBooking.TIMESTAMP0 = new Date(booking.bookingDate);
  vehicleBooking.VRM = booking.vrm;
  vehicleBooking.FK_APPTYP_APPL_TYP = booking.testCode;
  vehicleBooking.FK_LANTBD_DATE = new Date(booking.testDate);
  vehicleBooking.FK_STATN_ID = booking.pNumber;
  vehicleBooking.FK_VEH_SYST_NO = 1234567;
  vehicleBooking.COUNTED_AXLES = 2;

  const connection: Knex<unknown, unknown[]> = await dbConnection();

  const insertResult: string[] = connection
    .insert([vehicleBooking], ['VEHICLE_BOOKING_NO'])
    .into('VEHICLE_BOOKING') as unknown as string[];

  logger.info('insertVtBooking ending');

  return insertResult;
};
