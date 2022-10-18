/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EOL } from 'os';
import { validateVtBooking } from '../../../src/util/validators/VtBooking';
import { VtBooking } from '../../../src/interfaces/VtBooking';
import { getMockSqsEvent } from '../../resources/mSqsEvents';

let vtBooking: VtBooking;
let consoleSpy;
const event = getMockSqsEvent(1);

describe('Validate VtBooking', () => {
  beforeEach(() => {
    vtBooking = JSON.parse(event.Records[0].body) as VtBooking;
    // @ts-ignore
    consoleSpy = jest.spyOn(console._stdout, 'write');
    jest.clearAllMocks();
  });

  it('GIVEN a VtBooking WHEN it valid THEN the validation passes.', () => {
    validateVtBooking(vtBooking);
  });

  it('GIVEN a VtBooking WHEN it is invalid THEN the error is logged and an error thrown.', () => {
    vtBooking.name = undefined;
    expect(() => validateVtBooking(vtBooking)).toThrow(
      'Invalid event received.',
    );
    expect(consoleSpy).toHaveBeenCalledWith(`error: "name" is required${EOL}`);
  });

  it('GIVEN a VtBooking when it has both trailerId and vrm THEN the error is logged and an error thrown.', () => {
    vtBooking.trailerId = 'TRAILER';
    expect(() => validateVtBooking(vtBooking)).toThrow(
      'Invalid event received.',
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      `error: "value" contains a conflict between exclusive peers [vrm, trailerId]${EOL}`,
    );
  });

  it('GIVEN a VtBooking when it has neither trailerId or vrm THEN the error is logged and an error thrown.', () => {
    delete vtBooking.vrm;
    expect(() => validateVtBooking(vtBooking)).toThrow(
      'Invalid event received.',
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      `error: "value" must contain at least one of [vrm, trailerId]${EOL}`,
    );
  });
});
