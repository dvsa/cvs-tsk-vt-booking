# cvs-tsk-vt-booking

Part of the Siebel Decoupling process. Test results entered via VTA are routed through to the VEHICLE_BOOKING table used by VT. This function processes the test results feed from SQS, inserting them directly into the Oracle database. More details can be found at [Decoupling Siebel and VT](https://dvsa.atlassian.net/wiki/spaces/HVT/pages/60527518/Decoupling+Siebel+and+VT).

The insertion step into the oracle database can be turned off. To enable or disable the insertion set the environmental variable INSERT_BOOKINGS to true or false respectively.

## Requirements

- node v14
- npm v6
- aws cli v2

## Prerequisites

Create a `.env` file.

```shell
cp .env.example .env
```

## Build

```
npm i
npm run build
```

## Run Lambdas Locally

There are two options to run the lambda locally.

### Manual invoke

Run `npm run start`. This will instruct serverless offline to 'start' the lambda, which will create an instance of the lambda and wait to be called. Once running you can invoke the lambda using AWS CLI. A PowerShell example:

```powershell
aws lambda invoke --cli-binary-format raw-in-base64-out --payload fileb://event.json --endpoint-url http://localhost:3002 --function-name cvs-tsk-vt-booking-dev-vtBooking con:
```

You can keep invoking the lambda until you shutdown the serverless offline process. The event.json file used above, can be found in the test/resources folder.

### Auto invoke

Run `npm run invoke`. This will run the function and automatically call it with the payload from test/resources/event.json. It will only run once.

## Debug Lambdas Locally

There are three debug configurations setup for vscode.

- Debug Jest Tests: runs `jest` with the debugger attached
- Debug Start: runs `npm run start` with the debugger attached
- Debug Invoke: runs `npm run invoke` with the debugger attached
  There is an issue with the last two configurations. The debugger does not automatically close after the debugging session. It needs to be manually stopped before you can start a new session.

## SonarQube Scanning

SonarQube code coverage analysis has been added as part of the git prepush hook. This is to better align with what happens in the pipeline.  
To get it working locally, follow these steps:

- Ensure SonarQube is installed. Running in a [container](https://hub.docker.com/_/sonarqube) is a great option.
- Within SonarQube, Disable Force user authentication via Administration -> Configuration -> Security.
- Install jq with `sudo apt install jq` or `brew install jq`.
  When running `git push`, it will run tests followed by the SonarQube scan. If the scan fails or the unit test coverage is below 80%, the push is cancelled.

## Tests

- The [Jest](https://jestjs.io/) framework is used to run tests and collect code coverage
- To run the tests, run the following command within the root directory of the project: `npm test`
- Coverage results will be displayed on terminal and stored in the `coverage` directory
  - The coverage requirements can be set in `jest.config.js`

## Logging

Logging is handled by `https://github.com/winstonjs/winston`. A pre-configured logger is available, and can be used like so:

```ts
import logger from '../utils/logger';

logger.info('Hello world');
logger.error('Hello world');
logger.warn('Hello world');
```

To log an Error object you need to use an overload.

```ts
import logger from '../utils/logger';

try {
  //Error thrown.
} catch (error) {
  logger.error('', error);
}
```

Unlike the default console logging, it enables logging levels. The default level is `info`. This can be adjusted using an environmental variable called `LOG_LEVEL`. The `LOG_LEVEL` values used in this project are `debug`, `info`, `error` and are case sensitive.
