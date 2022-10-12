import logger from '../util/logger';
import { dbConnection } from './dbConnection';
import { TimebandPosition } from '../interfaces/TimebandPosition';
import { VtBooking } from '../interfaces/VtBooking';

export const timebandPositionDb = {
  async insert(vtBooking: VtBooking): Promise<void> {
    logger.info('timebandPosition insert starting');
    const connection = await dbConnection();

    const timebandPosition = {
      ...new TimebandPosition(),
      FK_STATN_ID: vtBooking.pNumber,
      FK_LANTBD_DATE: connection.raw(
        `to_date('${vtBooking.testDate}', 'yyyy-mm-dd')`,
      ),
      FK_LANTBD_OPENTIME: connection.raw(
        `to_date('${vtBooking.timeband.openTime}', 'yyyy-mm-dd hh24:mi:ss')`,
      ),
      TIMESTAMP0: connection.raw('sysdate'),
      START_TIME: connection.raw(
        `to_date('${vtBooking.testTime}', 'yyyy-mm-dd hh24:mi:ss')`,
      ),
      BOOKINGS_LITERAL: vtBooking.vrm,
    };

    const results: TimebandPosition[] = await connection
      .insert([timebandPosition])
      .into('TIMEBAND_POSITION');

    if (results.length === 0) {
      throw new Error('Insert timeband position failed. No data inserted.');
    }
  },
};
