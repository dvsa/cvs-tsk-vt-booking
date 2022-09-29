import logger from '../util/logger';
import { BookingHeader } from '../interfaces/BookingHeader';
import { bookingHeaderDb } from '../database/bookingHeaderDb';
import { VehicleBooking } from '../interfaces/VehicleBooking';
import { vehicleBookingDb } from '../database/vehicleBookingDb';
import { vehicleDb } from '../database/vehicleDb';
import { VtBooking } from '../interfaces/VtBooking';

export const vehicleBooking = {
  insert: async (vtBooking: VtBooking): Promise<void> => {
    logger.info('vehicleBooking insert starting');

    const existingBookings = await vehicleBookingDb.get(vtBooking);

    if (existingBookings.length > 0) {
      logger.info(
        `Booking for ${vtBooking.testCode} already exists for ${vtBooking.vrm} on ${vtBooking.testDate}.`,
      );

      return;
    }

    const bookingHeader = {
      ...new BookingHeader(),
      NAME0: vtBooking.name.substring(0, 50),
    };

    const bookingHeaderNo = await bookingHeaderDb.insert(bookingHeader);
    const vehicle = await vehicleDb.get(vtBooking.vrm);

    const booking = {
      ...new VehicleBooking(),
      FK_BKGHDR_NO: bookingHeaderNo,
      SHORT_NAME: vtBooking.name.substring(0, 10),
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
