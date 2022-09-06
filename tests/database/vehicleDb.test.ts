import { knex, Knex } from 'knex';
import { mocked } from 'ts-jest/utils';
import { vehicleDb } from '../../src/database/vehicleDb';

jest.mock('knex');
const mknex = mocked(knex, true);
const mKnex = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest
    .fn()
    .mockImplementationOnce(() => [{ VEHICLE_CLASS: 'L' }])
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
  it('GIVEN everything is okay WHEN  one vehicle is found THEN the details of the vehicle are returned.', async () => {
    const insertResult = await vehicleDb.get('12345');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.where).toBeCalledWith('CURR_REGMK', '12345   ');
    expect(insertResult).toEqual({ VEHICLE_CLASS: 'L' });
  });

  it('GIVEN an issue with the search WHEN no vehicles are returned THEN an error is thrown.', async () => {
    await expect(vehicleDb.get('12345')).rejects.toThrow(
      'Get vehicle failed. No vehicles returned.',
    );
  });

  it('GIVEN an issue with the search WHEN multiple vehicles are returned THEN an error is thrown.', async () => {
    await expect(vehicleDb.get('12345')).rejects.toThrow(
      'Get vehicle failed. Multiple vehicles returned.',
    );
  });
});
