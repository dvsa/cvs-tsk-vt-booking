import { Knex } from 'knex';

export class BookingHeader {
  USER_LOCATION = 999;

  USER_NO = 'XR';

  BOOKING_HEADER_NO: Knex.Raw<unknown>;

  DATE_MADE = new Date('0001-01-01 00:00:00');

  NAME0: string;

  TIMESTAMP0 = new Date('0001-01-01 00:00:00');

  USER_ID = 'cvsvbin';

  ACCT_NO = null;

  AGENT_ID = null;

  ADDR_1 = null;

  ADDR_2 = null;

  ADDR_3 = null;

  ADDR_4 = null;

  POSTTOWN = null;

  POSTCODE = null;

  TELEPHONE_NO = null;

  AUTO_LETTER_MARKER = null;

  MAN_LETTER_MARKER = null;

  AUTO_LETTER_SENT = null;

  MANUAL_LETTER_SENT = null;
}
