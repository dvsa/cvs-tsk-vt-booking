import { Knex } from 'knex';

export class VehicleBooking {
  FK_BKGHDR_USER_LOC = 999;

  FK_BKGHDR_USER_NO = 'XR';

  FK_BKGHDR_NO: Knex.Raw<unknown>;

  VEHICLE_BOOKING_NO = 1;

  COMBI_NUM = 1;

  STATUS0 = 40;

  SHORT_NAME: string;

  VEHICLE_CLASS: string;

  NO_OF_AXLES: number;

  TIMESTAMP0: Date;

  USER_ID = 'cvsvbin';

  FEE_REQUIRED = 0.0;

  FEE_PAID = 0.0;

  FEE_UNDR_OVR_MRKR = 'N';

  VAT_REQUIRED = 0.0;

  CANCELLATION_DATE = new Date('0001-01-01 00:00:00');

  RD_CHEQUE_AMOUNT = 0.0;

  LOCN_SUPLM_AMT = 0.0;

  AXLE_SUPLM_AMT = 0.0;

  OOH_SUPLM_AMT = 0.0;

  VRM: string;

  RD_CHEQUE_SWITCH = 'N';

  CUST_ACCT_PMNT_MKR = 1;

  OUT_OF_HOURS_MKR = 'N';

  PREV_FEE_SWTCH = 'Y';

  PROHIBITION_SWTCH = 'N';

  DANG_GOODS_SWTCH = 'N';

  TACHO_EXEMPT_MKR = 'N';

  SPEED_LMTR_EXEMPT = 'N';

  REMARKS = ' ';

  FK_ACCT_ACCT_NO = null;

  FK_APPTYP_APPL_TYP: string;

  FK_LANTBD_DATE: Date;

  FK_LANTBD_OPEN_TIM = new Date('0001-01-01 06:01:00');

  FK_STATN_ID: string;

  FK_TSLANE_NO = 6;

  FK_TBDPOS_ST_TIME = new Date('0001-01-01 08:01:00');

  FK_VEH_SYST_NO: number;

  FK_BKGHDR2_USER_LO = null;

  FK_BKGHDR2_USER_NO = null;

  FK_BKGHDR2_NO = null;

  FK_VEHBKG2_NO = null;

  FK_VEHBKG2_COMBI = null;

  COUNTED_AXLES: number;

  SVA_MR_NO = ' ';
}
