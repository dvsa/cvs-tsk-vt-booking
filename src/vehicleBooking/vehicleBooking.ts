import logger from '../util/logger';
import { VehicleBooking } from '../interfaces/VehicleBooking';
import { vehicleBookingDb } from '../database/vehicleBookingDb';
import { vehicleDb } from '../database/vehicleDb';
import { VtBooking } from '../interfaces/VtBooking';

export const vehicleBooking = {
  async insert(vtBooking: VtBooking): Promise<void> {
    logger.info('vehicleBooking insert starting');

    const vehicle = await vehicleDb.get(vtBooking.vrm);

    const booking = new VehicleBooking();
    booking.SHORT_NAME = vtBooking.name;
    booking.VEHICLE_CLASS = vehicle.VEHICLE_CLASS;
    booking.NO_OF_AXLES = vehicle.NO_OF_AXLES;
    booking.TIMESTAMP0 = new Date(vtBooking.bookingDate);
    booking.VRM = vtBooking.vrm;
    booking.FK_APPTYP_APPL_TYP = vtBooking.testCode;
    booking.FK_LANTBD_DATE = new Date(vtBooking.testDate);
    booking.FK_STATN_ID = vtBooking.pNumber;
    booking.FK_VEH_SYST_NO = vehicle.SYSTEM_NUMBER;
    booking.COUNTED_AXLES = vehicle.NO_OF_AXLES;

    await vehicleBookingDb.insert(booking);

    logger.info('vehicleBooking insert ending');
  },
};
