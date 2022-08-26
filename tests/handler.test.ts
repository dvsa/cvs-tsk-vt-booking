import event from './resources/event.json';
import { SQSEvent } from 'aws-lambda';
import { handler } from '../src/handler';

jest.mock('../src/database/database');
const bookingEvent = event as unknown as SQSEvent;

describe('handler function', () => {
  it('GIVEN an event WHEN the handler is invoked THEN the event is processed.', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: string = await handler(bookingEvent);

    expect(res).toBe('Event processed.');
  });

  it('GIVEN an event WHEN the handler is invoked with an invalid event THEN the event is not processed.', async () => {
    expect.assertions(1);
    event.Records = undefined;
    await expect(handler(bookingEvent)).rejects.toEqual(
      'SQS event is empty and cannot be processed',
    );
  });
});
