import { EventBridgeEvent } from 'aws-lambda';
import { insertVtBooking } from './database/database';
import logger from './util/logger';

/**
 * Lambda Handler
 *
 * @param {EventBridgeEvent} event
 * @returns {Promise<string>}
 */
export const handler = async (
  event: EventBridgeEvent<any, any>,
): Promise<string> => {
  logger.debug(`event: ${JSON.stringify(event, null, 2)}`);

  await insertVtBooking();

  return Promise.resolve('Event processed.');
};
