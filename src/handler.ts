import logger from './util/logger';
import { SQSEvent } from 'aws-lambda';
import { insertVtBooking } from './database/database';
import { validateVtBooking } from './util/validators/VtBooking';
import { VtBooking } from './interfaces/VtBooking';

/**
 * Lambda Handler
 *
 * @param {SQSEvent} event
 * @returns {Promise<string>}
 */
export const handler = async (
  event: SQSEvent,
): Promise<string> => {
  if (
    !event ||
    !event.Records ||
    !Array.isArray(event.Records) ||
    !event.Records.length
  ) {
    console.error('ERROR: SQS event is not defined.');
    return Promise.reject('SQS event is empty and cannot be processed');
  }

  for (const record of event.Records) {
    try {
      const payload = JSON.parse(record.body) as unknown;
      logger.debug(`validating record: ${JSON.stringify(record, null, 2)}`);
      validateVtBooking(payload);
      await insertVtBooking(payload as VtBooking);
    } catch (error) {
      logger.error('Error', error);
      return Promise.reject('SQS event could not be processed.');
    }
  }

  return Promise.resolve('Event processed.');
};
