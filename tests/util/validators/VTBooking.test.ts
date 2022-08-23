/* eslint-disable @typescript-eslint/ban-ts-comment */
import event from '../../resources/event.json';
import { EOL } from 'os';
import { validateVtBooking } from '../../../src/util/validators/VtBooking';
import { VtBooking } from '../../../src/interfaces/VtBooking';

const vtBooking = JSON.parse(event.Records[0].body) as VtBooking;

describe('Validate VtBooking', () => {
  it('GIVEN a VtBooking WHEN it valid THEN the validation passes.', () => {
    validateVtBooking(vtBooking);
  });

  it('GIVEN a VtBooking WHEN it is invalid THEN the error is logged and an error thrown.', () => {
    // @ts-ignore
    const consoleSpy = jest.spyOn(console._stdout, 'write');
    vtBooking.name = undefined;
    expect(() => validateVtBooking(vtBooking)).toThrow(
      'Invalid event received.',
    );
    expect(consoleSpy).toHaveBeenCalledWith(`error: "name" is required${EOL}`);
  });
});
