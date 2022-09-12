import logger from './util/logger';
import { SQSEvent } from 'aws-lambda';
import { validateVtBooking } from './util/validators/VtBooking';
import { vehicleBooking } from './vehicleBooking/vehicleBooking';
import { BatchItemFailuresResponse } from './interfaces/BatchItemFailureResponse';

/**
 * Lambda Handler
 *
 * @param {SQSEvent} event
 * @returns {Promise<BatchItemFailuresResponse>}
 */
export const handler = async (event: SQSEvent): Promise<BatchItemFailuresResponse> => {
  const res: BatchItemFailuresResponse = {
    batchItemFailures: [],
  };
  
  if (isEventUndefined(event)) {
    logger.error('ERROR: SQS event is not defined.');
    return Promise.reject('SQS event is empty and cannot be processed');
  }

  for (const record of event.Records) {
    const id = record.messageId;
    try {
      logger.info(`Processing batch item: ${id}`);
      logger.debug(`validating record: ${JSON.stringify(record, null, 2)}`);
      const vtBooking = validateVtBooking(JSON.parse(record.body));

      if (!isEnabeled()) {
        logger.info(
          'Event has been ignored - Lambda is set to not insert bookings into VEHICLE_BOOKING table',
        );
        continue;
      }

      await vehicleBooking.insert(vtBooking);
    } catch (error) {
      logger.error(`Batch item ${id} failed to be processed, putting back on SQS queue for 1 retry`);
      logger.error('Error', error);
      res.batchItemFailures.push({ itemIdentifier: id });
    }
  }
  return Promise.resolve(res);
};

function isEnabeled(): boolean {
  if (process.env.INSERT_BOOKINGS == 'false') return false;
  if (process.env.INSERT_BOOKINGS == 'true') return true;

  throw Error('INSERT_BOOKINGS environment variable must be true or false');
}

function isEventUndefined(event: SQSEvent): boolean {
  return (
    !event ||
    !event.Records ||
    !Array.isArray(event.Records) ||
    !event.Records.length
  );
}
