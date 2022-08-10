import event from './resources/event.json';
import { EventBridgeEvent } from 'aws-lambda';
import { handler } from '../src/handler';

jest.mock('../src/database/database');

describe('handler function', () => {
  it('GIVEN an event WHEN the handler is invoked THEN the event is processed.', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: string = await handler(event as EventBridgeEvent<any, any>);

    expect(res).toBe('Event processed.');
  });
});
