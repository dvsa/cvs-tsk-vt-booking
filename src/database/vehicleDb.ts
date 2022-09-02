import { dbConnection } from './dbConnection';
import { Vehicle } from '../interfaces/Vehicle';

export const vehicleDb = {
  async get(vrm: string): Promise<Vehicle> {
    const connection = await dbConnection();

    const results: Vehicle[] = await connection
      .select('VEHICLE_CLASS', 'NO_OF_AXLES', 'SYSTEM_NUMBER')
      .from<Vehicle>('VEHICLE')
      .where('CURR_REGMK', vrm.padEnd(8, ' '));

    if (results.length === 0) {
      throw new Error('Get vehicle failed. No vehicles returned.');
    }

    if (results.length > 1) {
      throw new Error('Get vehicle failed. Multiple vehicles returned.');
    }

    return results[0];
  },
};
