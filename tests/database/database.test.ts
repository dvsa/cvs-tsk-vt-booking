import event from '../resources/event.json';
import localOracleConfig from '../resources/localOracleConfig.json';
import { insertVtBooking } from '../../src/database/database';
import { getOracleCredentials } from '../../src/util/getOracleCredentials';
import { knex, Knex } from 'knex';
import { mocked } from 'ts-jest/utils';
import { VehicleBooking } from '../../src/interfaces/VehicleBooking';
import { VtBooking } from '../../src/interfaces/VtBooking';

jest.mock('knex');
const mknex = mocked(knex, true);
const mKnex = {
  insert: jest.fn().mockReturnThis(),
  into: jest.fn(() => [{ VEHICLE_BOOKING_NO: 1 }]),
  raw: jest.fn(() => null),
} as unknown as Knex;

mknex.mockImplementation(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => mKnex,
);

const vehicleBooking: VehicleBooking = {
  AXLE_SUPLM_AMT: 0,
  CANCELLATION_DATE: new Date('2001-01-01 00:00:00'),
  COMBI_NUM: 1,
  COUNTED_AXLES: 2,
  CUST_ACCT_PMNT_MKR: 1,
  DANG_GOODS_SWTCH: 'N',
  FEE_PAID: 0,
  FEE_REQUIRED: 0,
  FEE_UNDR_OVR_MRKR: 'N',
  FK_ACCT_ACCT_NO: null,
  FK_APPTYP_APPL_TYP: 'AAV',
  FK_BKGHDR2_NO: null,
  FK_BKGHDR2_USER_LO: null,
  FK_BKGHDR2_USER_NO: null,
  FK_BKGHDR_NO: null,
  FK_BKGHDR_USER_LOC: 999,
  FK_BKGHDR_USER_NO: 'XR',
  FK_LANTBD_DATE: new Date('2022-08-15 10:00:00'),
  FK_LANTBD_OPEN_TIM: new Date('2001-01-01 06:01:00'),
  FK_STATN_ID: 'P12345',
  FK_TBDPOS_ST_TIME: new Date('2001-01-01 08:01:00'),
  FK_TSLANE_NO: 6,
  FK_VEHBKG2_COMBI: null,
  FK_VEHBKG2_NO: null,
  FK_VEH_SYST_NO: 1234567,
  LOCN_SUPLM_AMT: 0,
  NO_OF_AXLES: 2,
  OOH_SUPLM_AMT: 0,
  OUT_OF_HOURS_MKR: 'N',
  PREV_FEE_SWTCH: 'Y',
  PROHIBITION_SWTCH: 'N',
  RD_CHEQUE_AMOUNT: 0,
  RD_CHEQUE_SWITCH: 'N',
  REMARKS: ' ',
  SHORT_NAME: "Bob's ATF",
  SPEED_LMTR_EXEMPT: 'N',
  STATUS0: 40,
  SVA_MR_NO: ' ',
  TACHO_EXEMPT_MKR: 'N',
  TIMESTAMP0: new Date('2022-08-10 10:00:00'),
  USER_ID: 'cvsvbin',
  VAT_REQUIRED: 0,
  VEHICLE_BOOKING_NO: 1,
  VEHICLE_CLASS: 'V',
  VRM: 'AB12CDE',
};

jest.mock('../../src/util/getOracleCredentials');
const mGetOracleCredentials = mocked(getOracleCredentials, true);
mGetOracleCredentials.mockImplementation(async () => {
  return Promise.resolve(localOracleConfig);
});

describe('database functions', () => {
  beforeEach(() => {
    process.env.ORACLE_CONFIG_SECRET = '';
  });

  it('GIVEN everything is okay WHEN the data is inserted THEN the objects are mapped correctly and VEHICLE_BOOKING_NO is returned.', async () => {
    const insertResult = await insertVtBooking(JSON.parse(event.Records[0].body) as unknown as VtBooking);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.insert).toBeCalledWith(
      [vehicleBooking],
      ['VEHICLE_BOOKING_NO'],
    );
    expect(insertResult[0]).toEqual({ VEHICLE_BOOKING_NO: 1 });
  });
});
