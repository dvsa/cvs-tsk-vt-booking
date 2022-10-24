import { knex, Knex } from 'knex';
import { mocked } from 'ts-jest/utils';
import { vehicleBookingDb } from '../../src/database/vehicleBookingDb';
import { psvVtBooking, trailerVtBooking } from '../resources/mVtBookings';
import {
  psvVehicleBooking,
  trailerVehicleBooking,
} from '../resources/mVehicleBookings';

jest.mock('knex');
const mknex = mocked(knex, true);
const mKnex = {
  insert: jest.fn().mockReturnThis(),
  into: jest
    .fn()
    .mockImplementationOnce(() => [{ FK_BKGHDR_NO: 1 }])
    .mockImplementationOnce(() => [{ FK_BKGHDR_NO: 1 }])
    .mockImplementationOnce(() => []),
  raw: jest.fn((input: string) => input),
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest
    .fn()
    .mockImplementationOnce(jest.fn().mockReturnThis())
    .mockImplementationOnce(() => []),
} as unknown as Knex;

mknex.mockImplementationOnce(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => mKnex,
);

describe('vehicleBookingDb functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN everything is okay WHEN the non-trailer test data is inserted THEN the objects are mapped correctly and FK_BKGHDR_NO is returned.', async () => {
    await vehicleBookingDb.insert(psvVtBooking);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.insert).toBeCalledWith([psvVehicleBooking], ['FK_BKGHDR_NO']);
  });

  it('GIVEN everything is okay WHEN the trailer test data is inserted THEN the objected are mapped correctly and FK_BKGHDR_NO is returned', async () => {
    await vehicleBookingDb.insert(trailerVtBooking);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.insert).toBeCalledWith(
      [trailerVehicleBooking],
      ['FK_BKGHDR_NO'],
    );
  });

  it('GIVEN an issue with the insert WHEN no results are returned THEN an error is thrown.', async () => {
    await expect(vehicleBookingDb.insert(psvVtBooking)).rejects.toThrow(
      'Insert vehicle booking failed. No data inserted.',
    );
  });

  it('GIVEN a check if the booking exists WHEN the database is called THEN the correct parameters are passed.', async () => {
    await vehicleBookingDb.get(psvVtBooking);

    expect(mKnex.where).toBeCalledWith('VRM', psvVtBooking.vrm);
    expect(mKnex.andWhere).toBeCalledWith(
      "FK_LANTBD_DATE = to_date('2022-08-15', 'yyyy-mm-dd')",
    );
    expect(mKnex.andWhere).toBeCalledWith(
      'FK_APPTYP_APPL_TYP',
      psvVtBooking.testCode,
    );
  });
});
