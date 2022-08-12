import logger from './util/logger';
import { EventBridgeEvent } from 'aws-lambda';
import { insertVtBooking } from './database/database';
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
  logger.debug(`event: ${JSON.stringify(event, null, 2)}`);

  await insertVtBooking(event.detail);

  return Promise.resolve('Event processed.');
};
