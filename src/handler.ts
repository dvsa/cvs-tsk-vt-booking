import logger from './util/logger';
import { BatchItemFailuresResponse } from './interfaces/BatchItemFailureResponse';
import { getActiveSites } from './util/getActiveSites';
import { bookingHeaderDb } from './database/bookingHeaderDb';
import { laneTimebandDb } from './database/laneTimebandDb';
import { SQSEvent } from 'aws-lambda';
import { timebandPositionDb } from './database/timebandPositionDb';
import { validateVtBooking } from './util/validators/VtBooking';
import { vehicleDb } from './database/vehicleDb';
import { vehicleBookingDb } from './database/vehicleBookingDb';

/**
 * Lambda Handler
 *
 * @param {SQSEvent} event
 * @returns {Promise<BatchItemFailuresResponse>}
 */
export const handler = async (
  event: SQSEvent,
): Promise<BatchItemFailuresResponse> => {
  const res: BatchItemFailuresResponse = {
    batchItemFailures: [],
  };

  if (isEventUndefined(event)) {
    logger.error('ERROR: SQS event is not defined.');
    return Promise.reject('SQS event is empty and cannot be processed');
  }

  const activeSites = await getActiveSites();
  for (const record of event.Records) {
    const id = record.messageId;
    try {
      logger.info(`Processing batch item: ${id}`);
      logger.debug(`validating record: ${JSON.stringify(record, null, 2)}`);
      const vtBooking = validateVtBooking(JSON.parse(record.body));

      if (!activeSites.includes(vtBooking.pNumber)) {
        logger.info(
          `Event has been ignored - Site ${vtBooking.pNumber} is not currently active.`,
        );
        continue;
      }

      if (!isEnabeled()) {
        logger.info(
          'Event has been ignored - Lambda is set to not insert bookings into VEHICLE_BOOKING table',
        );
        continue;
      }

      vtBooking.testTime = `0001-01-01 ${vtBooking.testDate.slice(11)}`;
      vtBooking.testDate = vtBooking.testDate.slice(0, 10);

      const existingBookings = await vehicleBookingDb.get(vtBooking);
      if (existingBookings.length > 0) {
        logger.info(
          `Booking for ${vtBooking.testCode} already exists for ${vtBooking.vrm} on ${vtBooking.testDate}.`,
        );
        continue;
      }

      const existingLaneTimebane = await laneTimebandDb.get(vtBooking);
      if (!existingLaneTimebane) {
        await laneTimebandDb.insert(vtBooking);
      }

      await timebandPositionDb.insert(vtBooking);
      vtBooking.bookingHeaderNo = await bookingHeaderDb.insert(vtBooking);
      vtBooking.vehicle = await vehicleDb.get(vtBooking);
      await vehicleBookingDb.insert(vtBooking);
    } catch (error) {
      logger.error(
        `Batch item ${id} failed to be processed, putting back on SQS queue for 1 retry`,
      );
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
