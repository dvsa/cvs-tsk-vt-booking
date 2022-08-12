import logger from '../util/logger';
import { dbConnection } from './dbConnection';
import { VehicleBooking } from '../interfaces/VehicleBooking';
import { Knex } from 'knex';

export const insertVtBooking = async function (): Promise<string[]> {
  logger.info('insertVtBooking starting');

  const vehicleBooking = new VehicleBooking();
  vehicleBooking.SHORT_NAME = 'TIP TRAILE';
  vehicleBooking.VEHICLE_CLASS = 'V';
  vehicleBooking.NO_OF_AXLES = 2;
  vehicleBooking.TIMESTAMP0 = new Date('2022-08-05 10:10:00');
  vehicleBooking.VRM = 'AB12 CDE';
  vehicleBooking.FK_APPTYP_APPL_TYP = 'AAV';
  vehicleBooking.FK_LANTBD_DATE = new Date('2022-08-05 10:10:00');
  vehicleBooking.FK_STATN_ID = 'P12345';
  vehicleBooking.FK_VEH_SYST_NO = 1234567;
  vehicleBooking.COUNTED_AXLES = 2;

  const connection: Knex<any, unknown[]> = await dbConnection();

  const insertResult: string[] = await connection.insert([vehicleBooking], ['VEHICLE_BOOKING_NO']).into('VEHICLE_BOOKING') as unknown as string[]; 

  logger.info('insertVtBooking ending');

  return insertResult;
};
