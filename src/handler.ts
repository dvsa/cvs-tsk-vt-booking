import logger from './util/logger';
import { SQSEvent } from 'aws-lambda';
import { validateVtBooking } from './util/validators/VtBooking';
import { vehicleBooking } from './vehicleBooking/vehicleBooking';

/**
 * Lambda Handler
 *
 * @param {SQSEvent} event
 * @returns {Promise<string>}
 */
export const handler = async (event: SQSEvent): Promise<string> => {
  if (isEventUndefined(event)) {
    logger.error('ERROR: SQS event is not defined.');
    return Promise.reject('SQS event is empty and cannot be processed');
  }

  for (const record of event.Records) {
    try {
      logger.debug(`validating record: ${JSON.stringify(record, null, 2)}`);
      const vtBooking = validateVtBooking(JSON.parse(record.body));
      await vehicleBooking.insert(vtBooking);
    } catch (error) {
      logger.error('Error', error);
      return Promise.reject('SQS event could not be processed.');
    }
  }

  return Promise.resolve('Event processed.');
};

function isEventUndefined(event: SQSEvent): boolean {
  return (
    !event ||
    !event.Records ||
    !Array.isArray(event.Records) ||
    !event.Records.length
  );
}
