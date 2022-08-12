import event from './resources/event.json';
import { EventBridgeEvent } from 'aws-lambda';
import { handler } from '../src/handler';
import { VtBooking } from '../src/interfaces/VtBooking';

jest.mock('../src/database/database');

describe('handler function', () => {
  it('GIVEN an event WHEN the handler is invoked THEN the event is processed.', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: string = await handler(
      event as EventBridgeEvent<'VT Booking', VtBooking>,
    );

    expect(res).toBe('Event processed.');
  });
});
