import logger from './util/logger';
import { EventBridgeEvent } from 'aws-lambda';
import { insertVtBooking } from './database/database';
import { validateVtBooking } from './util/validators/VtBooking';
import { VtBooking } from './interfaces/VtBooking';

/**
 * Lambda Handler
 *
 * @param {EventBridgeEvent} event
 * @returns {Promise<string>}
 */
export const handler = async (
  event: EventBridgeEvent<'VT Booking', VtBooking>,
): Promise<string> => {
  try {
    logger.debug(`event: ${JSON.stringify(event, null, 2)}`);
    validateVtBooking(event.detail);
    await insertVtBooking(event.detail);
  } catch (error) {
    logger.error('Error', error);
    return Promise.reject('Event could not be processed.');
  }

  return Promise.resolve('Event processed.');
};
