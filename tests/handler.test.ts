import event from './resources/event.json';
import { handler } from '../src/handler';
import { SQSEvent } from 'aws-lambda';
import { VtBooking } from '../src/interfaces/VtBooking';
import logger from '../src/util/logger';
import { vehicleBooking } from '../src/vehicleBooking/vehicleBooking';

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN an event WHEN the handler is invoked THEN the event is processed.', async () => {
    process.env.INSERT_BOOKINGS = 'true';

    bookingEvent.Records[0].body =
      '{"name":"Success","bookingDate": "2022-08-10 10:00:00","vrm":"AB12CDE","testCode":"AAV","testDate":"2022-08-15 10:00:00","pNumber":"P12345"}';
    const res: string = await handler(bookingEvent);

    expect(vehicleBooking.insert).toHaveBeenCalled();
    expect(res).toBe('Events processed.');
  });

  it('GIVEN an event WHEN an error is thrown THEN the error is returned by the handler.', async () => {
    process.env.INSERT_BOOKINGS = 'true';

    bookingEvent.Records[0].body =
      '{"name":"Failure","bookingDate": "2022-08-10 10:00:00","vrm":"AB12CDE","testCode":"AAV","testDate":"2022-08-15 10:00:00","pNumber":"P12345"}';

    await expect(handler(bookingEvent)).rejects.toEqual(
      'SQS event could not be processed.',
    );

    expect(vehicleBooking.insert).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith('Error', new Error('Oh no!'));
  });

  it('GIVEN an event WHEN the handler is invoked but processing is set to off THEN the event is not processed', async () => {
    process.env.INSERT_BOOKINGS = 'false';
    bookingEvent.Records[0].body =
      '{"name":"Success","bookingDate": "2022-08-10 10:00:00","vrm":"AB12CDE","testCode":"AAV","testDate":"2022-08-15 10:00:00","pNumber":"P12345"}';

    const res: string = await handler(bookingEvent);

    expect(logger.info).toHaveBeenNthCalledWith(1,
      'Event has been ignored - Lambda is set to not insert bookings into VEHICLE_BOOKING table',
    );
    expect(vehicleBooking.insert).not.toHaveBeenCalled();
    expect(res).toBe(
      'Events processed.',
    );
  });

  it('GIVEN an event WHEN the handler is invoked with an invalid event THEN the event is not processed.', async () => {
    process.env.INSERT_BOOKINGS = 'true';

    expect.assertions(2);
    bookingEvent.Records = undefined;
    await expect(handler(bookingEvent)).rejects.toEqual(
      'SQS event is empty and cannot be processed',
    );
    expect(vehicleBooking.insert).not.toHaveBeenCalled();
  });
});
