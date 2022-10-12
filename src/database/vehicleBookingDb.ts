import logger from '../util/logger';
import { dbConnection } from './dbConnection';
import { VehicleBooking } from '../interfaces/VehicleBooking';
import { VtBooking } from '../interfaces/VtBooking';

export const vehicleBookingDb = {
  async insert(vtBooking: VtBooking): Promise<void> {
    logger.info('vehicleBooking insert starting');
    const connection = await dbConnection();

    const vehicleBooking = {
      ...new VehicleBooking(),
      TIMESTAMP0: connection.raw('sysdate'),
      CANCELLATION_DATE: connection.raw(
        "to_date('0001-01-01 00:00:00', 'yyyy-mm-dd hh24:mi:ss')",
      ),
      FK_LANTBD_OPEN_TIM: connection.raw(
        `to_date('${vtBooking.timeband.openTime}', 'yyyy-mm-dd hh24:mi:ss')`,
      ),
      FK_TBDPOS_ST_TIME: connection.raw(
        `to_date('${vtBooking.testTime}', 'yyyy-mm-dd hh24:mi:ss')`,
      ),
      FK_BKGHDR_NO: vtBooking.bookingHeaderNo,
      SHORT_NAME: vtBooking.name.substring(0, 10),
      VEHICLE_CLASS: vtBooking.vehicle.VEHICLE_CLASS,
      NO_OF_AXLES: vtBooking.vehicle.NO_OF_AXLES,
      VRM: vtBooking.vrm,
      FK_APPTYP_APPL_TYP: vtBooking.testCode,
      FK_LANTBD_DATE: connection.raw(
        `to_date('${vtBooking.testDate}', 'yyyy-mm-dd')`,
      ),
      FK_STATN_ID: vtBooking.pNumber,
      FK_VEH_SYST_NO: vtBooking.vehicle.SYSTEM_NUMBER,
      COUNTED_AXLES: vtBooking.vehicle.NO_OF_AXLES,
    };

    const results: VehicleBooking[] = await connection
      .insert([vehicleBooking], ['FK_BKGHDR_NO'])
      .into('VEHICLE_BOOKING');

    if (results.length === 0) {
      throw new Error('Insert vehicle booking failed. No data inserted.');
    }
  },

  async get(vtBooking: VtBooking): Promise<VehicleBooking[]> {
    logger.info('vehicleBooking get starting');
    const connection = await dbConnection();

    return connection
      .select()
      .from<VehicleBooking>('VEHICLE_BOOKING')
      .where('VRM', vtBooking.vrm)
      .andWhere(
        connection.raw(
          `FK_LANTBD_DATE = to_date('${vtBooking.testDate}', 'yyyy-mm-dd')`,
        ),
      )
      .andWhere('FK_APPTYP_APPL_TYP', vtBooking.testCode);
  },
};
