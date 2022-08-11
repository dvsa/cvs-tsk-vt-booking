/* eslint-disable @typescript-eslint/no-explicit-any */
import { knex, Knex } from 'knex';
import logger from '../util/logger';
import { DatabaseConnectionConfig } from '../interfaces/DatabaseConnectionConfig';

let connection: Knex<any, unknown[]>;
let instance = 0;

function dbConnect(config: DatabaseConnectionConfig): Knex<any, unknown[]> {
  const conn = knex({
    client: 'oracledb',
    connection: {
      host: config.Database_Host,
      user: config.Database_User,
      password: config.Database_Password,
      database: config.Database_Database,
    },
  });

  return conn;
}

export const dbConnection = function (
  config: DatabaseConnectionConfig,
): Knex<any, unknown[]> {
  try {
    instance++;
    logger.debug(`dbConnection called ${instance} times`);

    if (connection != null) {
      logger.debug('db connection is already alive');
      return connection;
    } else {
      logger.debug('getting new db connection');
      connection = dbConnect(config);
      return connection;
    }
  } catch (error: unknown) {
    logger.error(
      `Error getting connection: ${JSON.stringify(
        error,
        Object.getOwnPropertyNames(error),
        2,
      )}`,
    );
    throw error;
  }
};
