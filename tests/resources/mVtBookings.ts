
import { VtBooking } from '../../src/interfaces/VtBooking';

export function getMockVtBooking(i: number): VtBooking {
  switch (i) {
    case 1:
      return <VtBooking>{
        ... new VtBooking(),
        name: "Bob's ATF",
        bookingDate: '2022-08-10 10:00:00',
        vrm: 'AB12CDE',
        testCode: 'AAV',
        testDate: '2022-08-15',
        pNumber: 'P12345',
        testTime: '0001-01-01 11:00:00',
        timeband: {
          openTime: '0001-01-01 06:00:00',
          closeTime: '0001-01-01 12:00:00',
        },
        bookingHeaderNo: 321,
        vehicle: {
          SYSTEM_NUMBER: 1234567,
          VEHICLE_CLASS: 'V',
          NO_OF_AXLES: 5,
        },
      };
    default:
      return <VtBooking>{
        ... new VtBooking(),
        name: "Bob's ATF",
        bookingDate: '2022-08-10 10:00:00',
        trailerId: 'TRAILER',
        testCode: 'AAV',
        testDate: '2022-08-15',
        pNumber: 'P12345',
        testTime: '0001-01-01 11:00:00',
        timeband: {
          openTime: '0001-01-01 06:00:00',
          closeTime: '0001-01-01 12:00:00',
        },
        bookingHeaderNo: 321,
        vehicle: {
          SYSTEM_NUMBER: 1234567,
          VEHICLE_CLASS: 'V',
          NO_OF_AXLES: 5,
        },
      };
  }
}
