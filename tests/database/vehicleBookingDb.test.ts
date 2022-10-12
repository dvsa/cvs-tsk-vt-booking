import vtBooking from '../resources/vtBooking.json';
import { knex, Knex } from 'knex';
import { mocked } from 'ts-jest/utils';
import { VehicleBooking } from '../../src/interfaces/VehicleBooking';
import { vehicleBookingDb } from '../../src/database/vehicleBookingDb';

jest.mock('knex');
const mknex = mocked(knex, true);
const mKnex = {
  insert: jest.fn().mockReturnThis(),
  into: jest
    .fn()
    .mockImplementationOnce(() => [{ FK_BKGHDR_NO: 1 }])
    .mockImplementationOnce(() => []),
  raw: jest.fn((input: string) => input),
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest
    .fn()
    .mockImplementationOnce(jest.fn().mockReturnThis())
    .mockImplementationOnce(() => []),
} as unknown as Knex;

mknex.mockImplementationOnce(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => mKnex,
);

const vehicleBooking: VehicleBooking = {
  AXLE_SUPLM_AMT: 0,
  CANCELLATION_DATE: "to_date('0001-01-01 00:00:00', 'yyyy-mm-dd hh24:mi:ss')",
  COMBI_NUM: 1,
  COUNTED_AXLES: 5,
  CUST_ACCT_PMNT_MKR: 1,
  DANG_GOODS_SWTCH: 'N',
  FEE_PAID: 0,
  FEE_REQUIRED: 0,
  FEE_UNDR_OVR_MRKR: 'N',
  FK_ACCT_ACCT_NO: '74926',
  FK_APPTYP_APPL_TYP: 'AAV',
  FK_BKGHDR2_NO: null,
  FK_BKGHDR2_USER_LO: null,
  FK_BKGHDR2_USER_NO: null,
  FK_BKGHDR_NO: 321,
  FK_BKGHDR_USER_LOC: 999,
  FK_BKGHDR_USER_NO: 'XR',
  FK_LANTBD_DATE: `to_date('${vtBooking.testDate}', 'yyyy-mm-dd')`,
  FK_LANTBD_OPEN_TIM: `to_date('${vtBooking.timeband.openTime}', 'yyyy-mm-dd hh24:mi:ss')`,
  FK_STATN_ID: 'P12345',
  FK_TBDPOS_ST_TIME: `to_date('${vtBooking.testTime}', 'yyyy-mm-dd hh24:mi:ss')`,
  FK_TSLANE_NO: 6,
  FK_VEHBKG2_COMBI: null,
  FK_VEHBKG2_NO: null,
  FK_VEH_SYST_NO: 1234567,
  LOCN_SUPLM_AMT: 0,
  NO_OF_AXLES: 5,
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
  TIMESTAMP0: 'sysdate',
  USER_ID: 'cvsvbin',
  VAT_REQUIRED: 0,
  VEHICLE_BOOKING_NO: 1,
  VEHICLE_CLASS: 'V',
  VRM: 'AB12CDE',
};

describe('vehicleBookingDb functions', () => {
  it('GIVEN everything is okay WHEN the data is inserted THEN the objects are mapped correctly and FK_BKGHDR_NO is returned.', async () => {
    await vehicleBookingDb.insert(vtBooking);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mKnex.insert).toBeCalledWith([vehicleBooking], ['FK_BKGHDR_NO']);
  });

  it('GIVEN an issue with the insert WHEN no results are returned THEN an error is thrown.', async () => {
    await expect(vehicleBookingDb.insert(vtBooking)).rejects.toThrow(
      'Insert vehicle booking failed. No data inserted.',
    );
  });

  it('GIVEN a check if the booking exists WHEN the database is called THEN the correct parameters are passed.', async () => {
    await vehicleBookingDb.get(vtBooking);

    expect(mKnex.where).toBeCalledWith('VRM', vtBooking.vrm);
    expect(mKnex.andWhere).toBeCalledWith(
      "FK_LANTBD_DATE = to_date('2022-08-15', 'yyyy-mm-dd')",
    );
    expect(mKnex.andWhere).toBeCalledWith(
      'FK_APPTYP_APPL_TYP',
      vtBooking.testCode,
    );
  });
});
