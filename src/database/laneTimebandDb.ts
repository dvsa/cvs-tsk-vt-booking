import logger from '../util/logger';
import { dbConnection } from './dbConnection';
import { LaneTimeband } from '../interfaces/LaneTimeband';
import { VtBooking } from '../interfaces/VtBooking';

export const laneTimebandDb = {
  async insert(vtBooking: VtBooking): Promise<void> {
    logger.info('laneTimeband insert starting');
    const connection = await dbConnection();

    const laneTimeband = {
      ...new LaneTimeband(),
      FK_STATN_ID: vtBooking.pNumber,
      TIMESTAMP0: connection.raw('sysdate'),
      DATE0: connection.raw(`to_date('${vtBooking.testDate}', 'yyyy-mm-dd')`),
      OPEN_TIME: connection.raw(
        `to_date('${vtBooking.timeband.openTime}', 'yyyy-mm-dd hh24:mi:ss')`,
      ),
      CLOSE_TIME: connection.raw(
        `to_date('${vtBooking.timeband.closeTime}', 'yyyy-mm-dd hh24:mi:ss')`,
      ),
      LAST_MULTI_RSRVN: connection.raw(
        "to_date('0001-01-01 00:00:01', 'yyyy-mm-dd hh24:mi:ss')",
      ),
    };

    await connection.insert([laneTimeband]).into('LANE_TIMEBAND');
  },

  async get(vtBooking: VtBooking): Promise<LaneTimeband> {
    logger.info('laneTimeband get starting');
    const connection = await dbConnection();

    setTimeband(vtBooking);

    return connection
      .select()
      .from<LaneTimeband>('LANE_TIMEBAND')
      .where('FK_STATN_ID', vtBooking.pNumber)
      .andWhere('FK_TSLANE_NO', 6)
      .andWhere(
        connection.raw(
          `OPEN_TIME = to_date('${vtBooking.timeband.openTime}', 'yyyy-mm-dd hh24:mi:ss')`,
        ),
      )
      .andWhere(
        connection.raw(
          `DATE0 = to_date('${vtBooking.testDate}', 'yyyy-mm-dd')`,
        ),
      )
      .first();
  },
};

function setTimeband(vtBooking: VtBooking) {
  const testTime = new Date(vtBooking.testTime).getTime();
  switch (true) {
    case testTime < new Date('0001-01-01 06:00:00').getTime():
      vtBooking.timeband = {
        openTime: '0001-01-01 00:00:00',
        closeTime: '0001-01-01 06:00:00',
      };
      break;
    case testTime < new Date('0001-01-01 12:00:00').getTime():
      vtBooking.timeband = {
        openTime: '0001-01-01 06:00:00',
        closeTime: '0001-01-01 12:00:00',
      };
      break;
    case testTime < new Date('0001-01-01 18:00:00').getTime():
      vtBooking.timeband = {
        openTime: '0001-01-01 12:00:00',
        closeTime: '0001-01-01 18:00:00',
      };
      break;
    case testTime < new Date('0001-01-01 23:30:00').getTime():
      vtBooking.timeband = {
        openTime: '0001-01-01 18:00:00',
        closeTime: '0001-01-01 23:30:00',
      };
      break;
  }
}
