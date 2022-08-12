import logger from '../util/logger';
import { dbConnection } from './dbConnection';
import { VehicleBooking } from '../interfaces/VehicleBooking';
import { VtBooking } from '../interfaces/VtBooking';

export const insertVtBooking = async function (
  booking: VtBooking,
): Promise<string[]> {
  logger.info('insertVtBooking starting');

  const vehicleBooking = new VehicleBooking();
  vehicleBooking.SHORT_NAME = booking.SHORT_NAME;
  vehicleBooking.VEHICLE_CLASS = 'V';
  vehicleBooking.NO_OF_AXLES = 2;
  vehicleBooking.TIMESTAMP0 = new Date(booking.TIMESTAMP0);
  vehicleBooking.VRM = booking.VRM;
  vehicleBooking.FK_APPTYP_APPL_TYP = booking.FK_APPTYP_APPL_TYP;
  vehicleBooking.FK_LANTBD_DATE = new Date(booking.FK_LANTBD_DATE);
  vehicleBooking.FK_STATN_ID = booking.FK_STATN_ID;
  vehicleBooking.FK_VEH_SYST_NO = 1234567;
  vehicleBooking.COUNTED_AXLES = 2;

  const insertResult: string[] = await dbConnection()
    .insert([vehicleBooking], ['VEHICLE_BOOKING_NO'])
    .into('VEHICLE_BOOKING');

  logger.info('insertVtBooking ending');

  return insertResult;
};
