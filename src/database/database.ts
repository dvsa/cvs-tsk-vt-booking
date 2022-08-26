import logger from '../util/logger';
import { dbConnection } from './dbConnection';
import { VehicleBooking } from '../interfaces/VehicleBooking';
import { VtBooking } from '../interfaces/VtBooking';

export const insertVtBooking = async function (
  booking: VtBooking,
): Promise<string[]> {
  logger.info('insertVtBooking starting');

  const connection = await dbConnection();

  const vehicleBooking = new VehicleBooking();
  vehicleBooking.FK_BKGHDR_NO = connection.raw(
    "COALESCE((SELECT MAX(FK_BKGHDR_NO) + 1 from VEHICLE_BOOKING where FK_BKGHDR_USER_NO = 'XR'), 1)",
  );
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

  const insertResult: string[] = connection
    .insert([vehicleBooking], ['VEHICLE_BOOKING_NO'])
    .into('VEHICLE_BOOKING') as unknown as string[];

  logger.info('insertVtBooking ending');

  return insertResult;
};
