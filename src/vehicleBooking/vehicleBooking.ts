import logger from '../util/logger';
import { VehicleBooking } from '../interfaces/VehicleBooking';
import { vehicleBookingDb } from '../database/vehicleBookingDb';
import { vehicleDb } from '../database/vehicleDb';
import { VtBooking } from '../interfaces/VtBooking';

export const vehicleBooking = {
  async insert(vtBooking: VtBooking): Promise<void> {
    logger.info('vehicleBooking insert starting');

    const vehicle = await vehicleDb.get(vtBooking.vrm);

    const booking = {
      ...new VehicleBooking(),
      SHORT_NAME: vtBooking.name,
      VEHICLE_CLASS: vehicle.VEHICLE_CLASS,
      NO_OF_AXLES: vehicle.NO_OF_AXLES,
      TIMESTAMP0: new Date(vtBooking.bookingDate),
      VRM: vtBooking.vrm,
      FK_APPTYP_APPL_TYP: vtBooking.testCode,
      FK_LANTBD_DATE: new Date(vtBooking.testDate),
      FK_STATN_ID: vtBooking.pNumber,
      FK_VEH_SYST_NO: vehicle.SYSTEM_NUMBER,
      COUNTED_AXLES: vehicle.NO_OF_AXLES,
    };

    await vehicleBookingDb.insert(booking);

    logger.info('vehicleBooking insert ending');
  },
};
