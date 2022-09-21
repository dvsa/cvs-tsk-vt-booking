/* eslint-disable @typescript-eslint/unbound-method */
import event from '../resources/event.json';
import logger from '../../src/util/logger';
import { BookingHeader } from '../../src/interfaces/BookingHeader';
import { bookingHeaderDb } from '../../src/database/bookingHeaderDb';
import { vehicleBooking } from '../../src/vehicleBooking/vehicleBooking';
import { VehicleBooking } from '../../src/interfaces/VehicleBooking';
import { vehicleBookingDb } from '../../src/database/vehicleBookingDb';
import { VtBooking } from '../../src/interfaces/VtBooking';
import { vehicleDb } from '../../src/database/vehicleDb';

jest.mock('../../src/util/logger');

jest.mock('../../src/database/bookingHeaderDb', () => {
  return {
    bookingHeaderDb: {
      insert: jest.fn(() => {
        return 54321;
      }),
    },
  };
});

jest.mock('../../src/database/vehicleDb', () => {
  return {
    vehicleDb: {
      get: jest.fn(() => {
        return {
          VEHICLE_CLASS: 'L',
          NO_OF_AXLES: 3,
          SYSTEM_NUMBER: 123454,
        };
      }),
    },
  };
});

jest.mock('../../src/database/vehicleBookingDb', () => {
  return {
    vehicleBookingDb: {
      insert: jest.fn(() => {}),
      get: jest
        .fn()
        .mockImplementationOnce(() => [])
        .mockImplementationOnce(() => [{ vrm: 'AB12CDE' }]),
    },
  };
});

const vtBooking = JSON.parse(event.Records[0].body) as VtBooking;

const bookingHeader = {
  ...new BookingHeader(),
  NAME0: vtBooking.name.substring(0, 50),
};

const booking = new VehicleBooking();
booking.FK_BKGHDR_NO = 54321;
booking.SHORT_NAME = vtBooking.name;
booking.VEHICLE_CLASS = 'L';
booking.NO_OF_AXLES = 3;
booking.TIMESTAMP0 = new Date(vtBooking.bookingDate);
booking.VRM = vtBooking.vrm;
booking.FK_APPTYP_APPL_TYP = vtBooking.testCode;
booking.FK_LANTBD_DATE = new Date(vtBooking.testDate);
booking.FK_STATN_ID = vtBooking.pNumber;
booking.FK_VEH_SYST_NO = 123454;
booking.COUNTED_AXLES = 3;

describe('vehicleBooking functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN everything is okay WHEN the booking is processed THEN the objects are mapped correctly.', async () => {
    await vehicleBooking.insert(vtBooking);

    expect(bookingHeaderDb.insert).toBeCalledWith(bookingHeader);
    expect(vehicleBookingDb.get).toBeCalledWith(vtBooking);
    expect(vehicleDb.get).toBeCalledWith('AB12CDE');
    expect(vehicleBookingDb.insert).toBeCalledWith(booking);
  });

  it('GIVEN a booking already exists WHEN the an attempt to insert the same booking is attempted THEN the insert is skipped.', async () => {
    await vehicleBooking.insert(vtBooking);

    expect(vehicleBookingDb.get).toBeCalledWith(vtBooking);
    expect(logger.info).toHaveBeenCalledWith(
      'Booking for AAV already exists for AB12CDE on 2022-08-15 00:00:00.',
    );
    expect(vehicleDb.get).toHaveBeenCalledTimes(0);
    expect(vehicleBookingDb.insert).toHaveBeenCalledTimes(0);
  });
});
