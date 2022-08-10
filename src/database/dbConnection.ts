/* eslint-disable @typescript-eslint/no-explicit-any */
import { knex, Knex } from 'knex';
import logger from '../util/logger';

let connection: Knex<any, unknown[]>;
let instance = 0;

function dbConnect(): Knex<any, unknown[]> {
  const conn = knex({
    client: 'oracledb',
    connection: {
      host: process.env.Database_Host,
      user: process.env.Database_User,
      password: process.env.Database_Password,
      database: process.env.Database_Database,
    },
  });

  return conn;
}

export const dbConnection = function (): Knex<any, unknown[]> {
  try {
    instance++;
    logger.debug(`dbConnection called ${instance} times`);

    if (connection != null) {
      logger.debug('db connection is already alive');
      return connection;
    } else {
      logger.debug('getting new db connection');
      connection = dbConnect();
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
