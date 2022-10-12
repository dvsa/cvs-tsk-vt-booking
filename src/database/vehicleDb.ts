import logger from '../util/logger';
import { dbConnection } from './dbConnection';
import { Vehicle } from '../interfaces/Vehicle';
import { VtBooking } from '../interfaces/VtBooking';

export const vehicleDb = {
  async get(vtBooking: VtBooking): Promise<Vehicle> {
    logger.info('vehicleDb get starting');
    const connection = await dbConnection();

    const results: Vehicle[] = await connection
      .select('VEHICLE_CLASS', 'NO_OF_AXLES', 'SYSTEM_NUMBER')
      .from<Vehicle>('VEHICLE')
      .where('CURR_REGMK', vtBooking.vrm.padEnd(8, ' '));

    if (results.length === 0) {
      throw new Error('Get vehicle failed. No vehicles returned.');
    }

    if (results.length > 1) {
      throw new Error('Get vehicle failed. Multiple vehicles returned.');
    }

    return results[0];
  },
};
