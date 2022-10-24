import { validateTestCode } from '../../../src/util/validators/testCode';

describe('Validate testCode', () => {
  it('GIVEN a testCode of AAV WHEN testCode validation occurs THEN the original AAV testCode is returned.', () => {
    const testCode = validateTestCode('AAV');

    expect(testCode).toEqual('AAV');
  });

  it('GIVEN a testCode of NVT WHEN testCode validation occurs THEN the replacement NPT testCode is returned.', () => {
    const testCode = validateTestCode('NVT');

    expect(testCode).toEqual('NPT');
  });

  it('GIVEN a testCode of NVV WHEN testCode validation occurs THEN the replacement NPV testCode is returned.', () => {
    const testCode = validateTestCode('NVV');

    expect(testCode).toEqual('NPV');
  });
});
