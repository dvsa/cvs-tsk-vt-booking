import { knex, Knex } from 'knex';
import { mocked } from 'ts-jest/utils';
import { vehicleBookingDb } from '../../src/database/vehicleBookingDb';
import { getMockVtBooking } from '../resources/mVtBookings';
import { getMockVehicleBooking } from '../resources/mVehicleBookings';

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

const nonTrailerBooking = getMockVtBooking(1);
const trailerBooking = getMockVtBooking(2);

const nonTrailerVehicleBooking = getMockVehicleBooking(1); 
const trailerVehicleBooking = getMockVehicleBooking(2);

describe('vehicleBookingDb functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN everything is okay WHEN the non-trailer test data is inserted THEN the objects are mapped correctly and FK_BKGHDR_NO is returned.', async () => {
    await vehicleBookingDb.insert(nonTrailerBooking);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.insert).toBeCalledWith([nonTrailerVehicleBooking], ['FK_BKGHDR_NO']);
  });

  it('GIVEN everything is okay WHEN the trailer test data is inserted THEN the objected are mapped correctly and FK_BKGHDR_NO is returned', async () => {
    await vehicleBookingDb.insert(trailerBooking);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.insert).toBeCalledWith([trailerVehicleBooking], ['FK_BKGHDR_NO']);
  });

  it('GIVEN an issue with the insert WHEN no results are returned THEN an error is thrown.', async () => {
    await expect(vehicleBookingDb.insert(nonTrailerBooking)).rejects.toThrow(
      'Insert vehicle booking failed. No data inserted.',
    );
  });

  it('GIVEN a check if the booking exists WHEN the database is called THEN the correct parameters are passed.', async () => {
    await vehicleBookingDb.get(nonTrailerBooking);

    expect(mKnex.where).toBeCalledWith('VRM', nonTrailerBooking.vrm);
    expect(mKnex.andWhere).toBeCalledWith(
      "FK_LANTBD_DATE = to_date('2022-08-15', 'yyyy-mm-dd')",
    );
    expect(mKnex.andWhere).toBeCalledWith(
      'FK_APPTYP_APPL_TYP',
      nonTrailerBooking.testCode,
    );
  });
});
