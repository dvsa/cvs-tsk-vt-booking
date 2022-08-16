import event from './resources/event.json';
import { EventBridgeEvent } from 'aws-lambda';
import { handler } from '../src/handler';
import { VtBooking } from '../src/interfaces/VtBooking';

jest.mock('../src/database/database');
const bookingEvent = event as EventBridgeEvent<'VT Booking', VtBooking>;

describe('handler function', () => {
  it('GIVEN an event WHEN the handler is invoked THEN the event is processed.', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: string = await handler(bookingEvent);

    expect(res).toBe('Event processed.');
  });

  it('GIVEN an event WHEN the handler is invoked with an invalid event THEN the event is not processed.', async () => {
    expect.assertions(1);
    event.detail.name = undefined;
    await expect(handler(bookingEvent)).rejects.toEqual(
      'Event could not be processed.',
    );
  });
});
