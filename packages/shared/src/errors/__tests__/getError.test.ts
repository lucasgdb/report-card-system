import getError from '../getError';

describe('error handler', () => {
  const errors = new Array(new Error('TEST_CODE'));
  const error = new Error('TEST_CODE');

  describe('getError', () => {
    it('should return the error when find some code in error array', () => {
      const testCodeError = getError(errors, 'TEST_CODE');
      expect(testCodeError).toMatchObject({ message: 'TEST_CODE' });
    });

    it('should return the error when find some code in error object', () => {
      const testCodeError = getError(error, 'TEST_CODE');
      expect(testCodeError).toMatchObject({ message: 'TEST_CODE' });
    });

    it('should return null when not find some code in error array', () => {
      const testCodeError = getError(errors, 'RANDOM_CODE');
      expect(testCodeError).toBeNull();
    });

    it('should return null when not find some code in error object', () => {
      const testCodeError = getError(error, 'RANDOM_CODE');
      expect(testCodeError).toBeNull();
    });
  });
});
