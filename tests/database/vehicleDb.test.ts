import { knex, Knex } from 'knex';
import { mocked } from 'ts-jest/utils';
import { vehicleDb } from '../../src/database/vehicleDb';
import { psvVtBooking, trailerVtBooking } from '../resources/mVtBookings';

jest.mock('knex');
const mknex = mocked(knex, true);
const mKnex = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest
    .fn()
    .mockImplementationOnce(() => [{ VEHICLE_CLASS: 'L' }])
    .mockImplementationOnce(() => [{ VEHICLE_CLASS: 'T' }])
    .mockImplementationOnce(() => [])
    .mockImplementationOnce(() => [
      { VEHICLE_CLASS: 'L' },
      { VEHICLE_CLASS: 'L' },
    ]),
} as unknown as Knex;

mknex.mockImplementationOnce(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => mKnex,
);

describe('vehicleDb functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN everything is okay WHEN  one vehicle is found THEN the details of the vehicle are returned.', async () => {
    const insertResult = await vehicleDb.get(psvVtBooking);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.where).toBeCalledWith('CURR_REGMK', 'AB12CDE ');
    expect(insertResult).toEqual({ VEHICLE_CLASS: 'L' });
  });

  it('GIVEN everything is okay WHEN one trailer is found THEN the details of the vehicle are returned', async () => {
    const insertResult = await vehicleDb.get(trailerVtBooking);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.where).toBeCalledWith('TRAILER_ID', 'TRAILER ');
    expect(insertResult).toEqual({ VEHICLE_CLASS: 'T' });
  });

  it('GIVEN an issue with the search WHEN no vehicles are returned THEN an error is thrown.', async () => {
    await expect(vehicleDb.get(psvVtBooking)).rejects.toThrow(
      'Get vehicle failed. No vehicles returned.',
    );
  });

  it('GIVEN an issue with the search WHEN multiple vehicles are returned THEN an error is thrown.', async () => {
    await expect(vehicleDb.get(psvVtBooking)).rejects.toThrow(
      'Get vehicle failed. Multiple vehicles returned.',
    );
  });
});
