const testCodeMaps = [
  {
    original: 'NVT',
    replacement: 'NPT',
  },
  {
    original: 'NVV',
    replacement: 'NPV',
  },
];

export const validateTestCode = (testCode: string): string => {
  return (
    testCodeMaps.find((x) => x.original === testCode)?.replacement ?? testCode
  );
};
