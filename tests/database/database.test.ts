import { insertVtBooking } from '../../src/database/database';
import localOracleConfig from '../../src/config/localOracleConfig.json';
import { knex, Knex } from 'knex';
import { mocked } from 'ts-jest/utils';
import { getOracleCredentials } from '../../src/util/getOracleCredentials';

jest.mock('knex');
const mknex = mocked(knex, true);
const ent = {
  VEHICLE_BOOKING_NO: 1,
};
const mKnex = {
  insert: jest.fn().mockReturnThis(),
  into: jest.fn(() => [ent]),
} as unknown as Knex;

mknex.mockImplementation(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => mKnex,
);

jest.mock('../../src/util/getOracleCredentials');
const mGetOracleCredentials = mocked(getOracleCredentials, true);
mGetOracleCredentials.mockImplementation(async () => {
  return Promise.resolve(localOracleConfig);
});

describe('database functions', () => {
  beforeEach(() => {
    process.env.ORACLE_CONFIG_SECRET = '';
  });

  it('GIVEN everything is okay WHEN the data is inserted THEN the VEHICLE_BOOKING_NO is returned.', async () => {
    const insertResult = await insertVtBooking();
    expect(insertResult[0]).toEqual({ VEHICLE_BOOKING_NO: 1 });
  });
});
