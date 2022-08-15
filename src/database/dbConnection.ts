/* eslint-disable @typescript-eslint/no-explicit-any */
import { knex, Knex } from 'knex';
import logger from '../util/logger';
import { DatabaseConnectionConfig } from '../interfaces/DatabaseConnectionConfig';
import { getOracleCredentials } from '../util/getOracleCredentials';

let connection: Knex<unknown, unknown[]>;
let instance = 0;

export async function dbConnect(): Promise<Knex<unknown, unknown[]>> {
  const config: DatabaseConnectionConfig = await getOracleCredentials(
    process.env.ORACLE_CONFIG_SECRET,
  );

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

export const dbConnection = async function (): Promise<Knex<unknown, unknown[]>> {
  try {
    instance++;
    logger.debug(`dbConnection called ${instance} times`);
    if (connection != null) {
      logger.debug('db connection is already alive');
      return connection;
    } else {
      logger.debug('getting new db connection');
      connection = await dbConnect();
      return connection;
    }
  } catch (error) {
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
