/* eslint-disable @typescript-eslint/unbound-method */
import doubleEvent from './resources/doubleEvent.json';
import event from './resources/event.json';
import logger from '../src/util/logger';
import notMigratedEvent from './resources/notMigratedEvent.json';
import { BatchItemFailuresResponse } from '../src/interfaces/BatchItemFailureResponse';
import { handler } from '../src/handler';
import { SQSEvent } from 'aws-lambda';
import { vehicleBookingDb } from '../src/database/vehicleBookingDb';
import { VtBooking } from '../src/interfaces/VtBooking';

const bookingEvent = event as unknown as SQSEvent;
const twoBookingEvent = doubleEvent as unknown as SQSEvent;
const inactiveEvent = notMigratedEvent as unknown as SQSEvent;

jest.mock('../src/database/vehicleBookingDb', () => {
  return {
    vehicleBookingDb: {
      insert: jest.fn((booking: VtBooking) => {
        switch (booking.name) {
          case 'Success':
            return {};
          case 'Failure':
            throw Error('Oh no!');
        }
      }),
      get: jest.fn(() => {
        return [];
      }),
    },
  };
});

jest.mock('../src/database/bookingHeaderDb', () => {
  return {
    bookingHeaderDb: {
      insert: jest.fn(() => {
        return 123;
      }),
    },
  };
});

jest.mock('../src/database/laneTimebandDb', () => {
  return {
    laneTimebandDb: {
      insert: jest.fn(() => {
        return;
      }),
      get: jest.fn(() => {
        return [];
      }),
    },
  };
});

jest.mock('../src/database/timebandPositionDb', () => {
  return {
    timebandPositionDb: {
      insert: jest.fn(() => {
        return;
      }),
    },
  };
});

jest.mock('../src/database/vehicleDb', () => {
  return {
    vehicleDb: {
      get: jest.fn(() => {
        return {};
      }),
    },
  };
});

jest.mock('../src/util/getActiveSites', () => {
  return {
    getActiveSites: jest.fn(() => {
      return ['P12345', 'P123456'];
    }),
  };
});

jest.mock('../src/util/logger');

describe('handler function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN INSERT_BOOKINGS is not set WHEN the handler is invoked THEN the function returns an error.', async () => {
    const res: BatchItemFailuresResponse = await handler(bookingEvent);

    expect(logger.error).toHaveBeenCalledWith(
      'Error',
      new Error('INSERT_BOOKINGS environment variable must be true or false'),
    );
    expect(vehicleBookingDb.insert).not.toHaveBeenCalled();
    expect(res).toEqual(<BatchItemFailuresResponse>{
      batchItemFailures: [{ itemIdentifier: 'string' }],
    });
  });

  it('GIVEN an event WHEN the handler is invoked THEN the event is processed.', async () => {
    process.env.INSERT_BOOKINGS = 'true';

    const res: BatchItemFailuresResponse = await handler(bookingEvent);

    expect(vehicleBookingDb.insert).toHaveBeenCalled();
    expect(res).toEqual(<BatchItemFailuresResponse>{ batchItemFailures: [] });
  });

  it('GIVEN an event WHEN an error is thrown THEN the error is returned by the handler.', async () => {
    process.env.INSERT_BOOKINGS = 'true';

    bookingEvent.Records[0].body =
      '{"name":"Failure","bookingDate": "2022-08-10 10:00:00","vrm":"AB12CDE","testCode":"AAV","testDate":"2022-08-15 10:00:00","pNumber":"P12345"}';

    const res = await handler(bookingEvent);

    expect(res).toEqual(<BatchItemFailuresResponse>{
      batchItemFailures: [{ itemIdentifier: 'string' }],
    });

    expect(vehicleBookingDb.insert).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith('Error', new Error('Oh no!'));
  });

  it('GIVEN an event WHEN an error is thrown on one record THEN the error is returned by the handler but the other event is processed', async () => {
    process.env.INSERT_BOOKINGS = 'true';

    const res = await handler(twoBookingEvent);

    expect(res).toEqual(<BatchItemFailuresResponse>{
      batchItemFailures: [{ itemIdentifier: 'string' }],
    });

    expect(vehicleBookingDb.insert).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith('Error', new Error('Oh no!'));
  });

  it('GIVEN an event WHEN the handler is invoked but processing is set to off THEN the event is not processed', async () => {
    process.env.INSERT_BOOKINGS = 'false';

    const res: BatchItemFailuresResponse = await handler(bookingEvent);

    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      'Event has been ignored - Lambda is set to not insert bookings into VEHICLE_BOOKING table',
    );
    expect(vehicleBookingDb.insert).not.toHaveBeenCalled();
    expect(res).toEqual(<BatchItemFailuresResponse>{ batchItemFailures: [] });
  });

  it('GIVEN an event WHEN the handler is invoked with an invalid event THEN the event is not processed.', async () => {
    process.env.INSERT_BOOKINGS = 'true';

    expect.assertions(2);
    bookingEvent.Records = undefined;
    await expect(handler(bookingEvent)).rejects.toEqual(
      'SQS event is empty and cannot be processed',
    );
    expect(vehicleBookingDb.insert).not.toHaveBeenCalled();
  });

  it('GIVEN an event WHEN the handler is invoked with an event from an inactive ATF THEN the event is not processed.', async () => {
    process.env.INSERT_BOOKINGS = 'true';

    const res: BatchItemFailuresResponse = await handler(inactiveEvent);

    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      'Event has been ignored - Site P54321 is not currently active.',
    );
    expect(vehicleBookingDb.insert).not.toHaveBeenCalled();
    expect(res).toEqual(<BatchItemFailuresResponse>{ batchItemFailures: [] });
  });
});
