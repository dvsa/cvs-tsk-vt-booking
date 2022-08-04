import type { EventBridgeEvent } from 'aws-lambda';
import event from './resources/event.json';
import { handler } from '../src/handler';

describe('handler function', () => {
  it('GIVEN an event WHEN the handler is invoked THEN the event is processed.', async () => {
    const res: string = await handler(event as EventBridgeEvent<any, any>);

    expect(res).toBe('Event processed.');
  });
});
