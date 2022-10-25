/* eslint-disable security/detect-object-injection */
import { testCodeMaps } from '../../../src/util/validators/testCode';

describe('Validate testCode mappings', () => {
  it('GIVEN a testCode of AAV WHEN testCode validation occurs THEN the original AAV testCode is returned.', () => {
    let testCode = 'AAV';
    testCode = testCodeMaps[testCode] ?? testCode;

    expect(testCode).toEqual('AAV');
  });

  it('GIVEN a testCode of NVT WHEN testCode validation occurs THEN the replacement NPT testCode is returned.', () => {
    let testCode = 'NVT';
    testCode = testCodeMaps[testCode] ?? testCode;

    expect(testCode).toEqual('NPT');
  });

  it('GIVEN a testCode of NVV WHEN testCode validation occurs THEN the replacement NPV testCode is returned.', () => {
    let testCode = 'NVV';
    testCode = testCodeMaps[testCode] ?? testCode;

    expect(testCode).toEqual('NPV');
  });
});
