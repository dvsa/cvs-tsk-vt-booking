import event from './resources/event.json';
import { handler } from '../src/handler';
import { SQSEvent } from 'aws-lambda';
import { VtBooking } from '../src/interfaces/VtBooking';
import logger from '../src/util/logger';

const bookingEvent = event as unknown as SQSEvent;

jest.mock('../src/vehicleBooking/vehicleBooking', () => {
  return {
    vehicleBooking: {
      insert: jest.fn((vtBooking: VtBooking) => {
        switch (vtBooking.name) {
          case 'Success':
            return {};
          case 'Failure':
            throw Error('Oh no!');
        }
      }),
    },
  };
});

jest.mock('../src/util/logger');

describe('handler function', () => {
  it('GIVEN an event WHEN the handler is invoked THEN the event is processed.', async () => {
    bookingEvent.Records[0].body =
      '{"name":"Success","bookingDate": "2022-08-10 10:00:00","vrm":"AB12CDE","testCode":"AAV","testDate":"2022-08-15 10:00:00","pNumber":"P12345"}';
    const res: string = await handler(bookingEvent);

    expect(res).toBe('Events processed.');
  });

  it('GIVEN an event WHEN an error is thrown THEN the error is returned by the handler.', async () => {
    bookingEvent.Records[0].body =
      '{"name":"Failure","bookingDate": "2022-08-10 10:00:00","vrm":"AB12CDE","testCode":"AAV","testDate":"2022-08-15 10:00:00","pNumber":"P12345"}';

    await expect(handler(bookingEvent)).rejects.toEqual(
      'SQS event could not be processed.',
    );
    expect(logger.error).toHaveBeenCalledWith('Error', new Error('Oh no!'));
  });

  it('GIVEN an event WHEN the handler is invoked with an invalid event THEN the event is not processed.', async () => {
    expect.assertions(1);
    bookingEvent.Records = undefined;
    await expect(handler(bookingEvent)).rejects.toEqual(
      'SQS event is empty and cannot be processed',
    );
  });
});
