import { randBetween } from './index';

describe('Test randBetween() function', () => {
  const upperLimit: number = 10;
  const lowerLimit: number = 1;

  test('results should not exceed the maximum.', async () => {
    const resultSet: number[] = [];
    for (let i = 0; i < (upperLimit ^ 2); i++) {
      resultSet.push(await randBetween(lowerLimit, upperLimit));
    }

    const resultSetMax = resultSet.reduce((a, b) => {
      return a > b ? a : b;
    });

    expect(resultSetMax).toBeLessThanOrEqual(upperLimit);
  });

  test('results should not be lower than minimum', async () => {
    const resultSet: number[] = [];
    for (let i = 0; i < (upperLimit ^ 2); i++) {
      resultSet.push(await randBetween(lowerLimit, upperLimit));
    }

    const resultSetMin = resultSet.reduce((a, b) => {
      return a < b ? a : b;
    });

    expect(resultSetMin).toBeGreaterThanOrEqual(lowerLimit);
  });
});
