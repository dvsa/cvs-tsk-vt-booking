import localOracleConfig from '../resources/localOracleConfig.json';
import logger from '../../src/util/logger';
import { dbConnect, dbConnection } from '../../src/database/dbConnection';
import { getOracleCredentials } from '../../src/util/getOracleCredentials';
import { knex, Knex } from 'knex';
import { mocked } from 'ts-jest/utils';

jest.mock('../../src/util/logger');

jest.mock('knex', () => ({
  knex: jest.fn(),
}));

jest.mock('../../src/util/getOracleCredentials');

const mGetOracleCredentials = mocked(getOracleCredentials, true);

mGetOracleCredentials.mockImplementation(async () => {
  return Promise.resolve(localOracleConfig);
});

describe('dbConnection functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN an error WHEN inserting data THEN the error is logged and the exception propagated.', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    knex.mockImplementation(() => {
      throw new Error('It did not work.');
    });
    await expect(dbConnection()).rejects.toThrow('It did not work.');
    expect(logger.debug).toHaveBeenCalledTimes(2);
    expect(logger.debug).toHaveBeenNthCalledWith(
      1,
      'dbConnection called 1 times',
    );
    expect(logger.debug).toHaveBeenNthCalledWith(
      2,
      'getting new db connection',
    );
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('It did not work.'),
    );
    expect.assertions(6);
  });

  it('GIVEN inserting data WHEN multiple inserts occur THEN the same connection is used.', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    knex.mockImplementation(() => ({} as unknown as Knex));

    await dbConnection();
    expect(logger.debug).toHaveBeenCalledTimes(2);
    expect(logger.debug).toHaveBeenNthCalledWith(
      1,
      'dbConnection called 2 times',
    );
    expect(logger.debug).toHaveBeenNthCalledWith(
      2,
      'getting new db connection',
    );
    await dbConnection();
    expect(logger.debug).toHaveBeenCalledTimes(4);
    expect(logger.debug).toHaveBeenNthCalledWith(
      3,
      'dbConnection called 3 times',
    );
    expect(logger.debug).toHaveBeenNthCalledWith(
      4,
      'db connection is already alive',
    );
    expect.assertions(6);
  });

  it('GIVEN lambda is running WHEN developing locally THEN config is retrieved from file', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    knex.mockImplementation(() => ({} as unknown as Knex));

    await dbConnect();
    expect(mGetOracleCredentials).toHaveBeenCalledTimes(1);
    expect(knex).toHaveBeenCalledWith({
      client: 'oracledb',
      connection: {
        host: 'string',
        user: 'string',
        password: 'string',
        database: 'string',
      },
    });
    expect.assertions(2);
  });

  it('GIVEN lambda is running WHEN deployed THEN config is retrieved from secrets manager', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    knex.mockImplementation(() => ({} as unknown as Knex));

    await dbConnect();
    expect(mGetOracleCredentials).toHaveBeenCalledTimes(1);
    expect(knex).toHaveBeenCalledWith({
      client: 'oracledb',
      connection: {
        host: 'string',
        user: 'string',
        password: 'string',
        database: 'string',
      },
    });
    expect.assertions(2);
  });
});
