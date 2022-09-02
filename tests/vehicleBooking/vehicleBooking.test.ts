/* eslint-disable @typescript-eslint/unbound-method */
import event from '../resources/event.json';
import { vehicleBooking } from '../../src/vehicleBooking/vehicleBooking';
import { VehicleBooking } from '../../src/interfaces/VehicleBooking';
import { vehicleBookingDb } from '../../src/database/vehicleBookingDb';
import { VtBooking } from '../../src/interfaces/VtBooking';
import { vehicleDb } from '../../src/database/vehicleDb';

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
    },
  };
});

const vtBooking = JSON.parse(event.Records[0].body) as VtBooking;

const booking = new VehicleBooking();
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
  it('GIVEN everything is okay WHEN the booking is processed THEN the objects are mapped correctly.', async () => {
    await vehicleBooking.insert(vtBooking);

    expect(vehicleDb.get).toBeCalledWith('AB12CDE');
    expect(vehicleBookingDb.insert).toBeCalledWith(booking);
  });
});
