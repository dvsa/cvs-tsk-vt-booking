import { SQSEvent } from 'aws-lambda';

export function getMockSqsEvent(i: number): SQSEvent {
  switch (i) {
    case 1: 
      return <SQSEvent>{
        Records: [
          {
            body: '{"name":"Success","bookingDate": "2022-08-10 10:00:00","vrm":"AB12CDE","testCode":"AAV","testDate":"2022-08-15 11:00:00","pNumber":"P12345"}',
            messageId: 'string',
            receiptHandle: 'string',
            md5OfBody: 'string',
            eventSource: 'string',
            eventSourceARN: 'string',
            awsRegion: 'string',
          },
        ],
      };
    case 2:
      return <SQSEvent>{
        Records: [
          {
            body: '{"name":"Failure","bookingDate": "2022-08-10 10:00:00","vrm":"AB12CDE","testCode":"AAV","testDate":"2022-08-15 11:00:00","pNumber":"P12345"}',
            messageId: 'string',
            receiptHandle: 'string',
            md5OfBody: 'string',
            eventSource: 'string',
            eventSourceARN: 'string',
            awsRegion: 'string',
          },
          {
            body: '{"name":"Success","bookingDate": "2022-08-10 10:00:01","vrm":"AB12CDEF","testCode":"AAV","testDate":"2022-08-15 11:00:01","pNumber":"P123456"}',
            messageId: 'string',
            receiptHandle: 'string',
            md5OfBody: 'string',
            eventSource: 'string',
            eventSourceARN: 'string',
            awsRegion: 'string',
          },
        ],
      };
    case 3:
      return <SQSEvent>{
        Records: [
          {
            body: '{"name":"Success","bookingDate": "2022-08-10 10:00:00","vrm":"AB12CDE","testCode":"AAV","testDate":"2022-08-15 11:00:00","pNumber":"P54321"}',
            messageId: 'string',
            receiptHandle: 'string',
            md5OfBody: 'string',
            eventSource: 'string',
            eventSourceARN: 'string',
            awsRegion: 'string',
          },
        ],
      };
    default:
      return <SQSEvent>{};
  }
}
