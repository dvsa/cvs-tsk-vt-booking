import logger from '../../src/util/logger';
import { dbConnection } from '../../src/database/dbConnection';
import { knex, Knex } from 'knex';

jest.mock('../../src/util/logger');

jest.mock('knex', () => ({
  knex: jest.fn(),
}));

describe('dbConnection functions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('GIVEN an error WHEN inserting data THEN the error is logged and the exception propagated.', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    knex.mockImplementation(() => {
      throw new Error('It did not work.');
    });

    expect(() => dbConnection()).toThrow('It did not work.');
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
  });

  it('GIVEN inserting data WHEN multiple inserts occur THEN the same connection is used.', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    knex.mockImplementation(() => ({} as unknown as Knex));

    dbConnection();
    expect(logger.debug).toHaveBeenCalledTimes(2);
    expect(logger.debug).toHaveBeenNthCalledWith(
      1,
      'dbConnection called 2 times',
    );
    expect(logger.debug).toHaveBeenNthCalledWith(
      2,
      'getting new db connection',
    );
    dbConnection();
    expect(logger.debug).toHaveBeenCalledTimes(4);
    expect(logger.debug).toHaveBeenNthCalledWith(
      3,
      'dbConnection called 3 times',
    );
    expect(logger.debug).toHaveBeenNthCalledWith(
      4,
      'db connection is already alive',
    );
  });
});
