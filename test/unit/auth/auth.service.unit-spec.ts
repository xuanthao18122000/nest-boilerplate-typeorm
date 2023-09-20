describe('sum function', () => {
  test('should return the correct sum', () => {
    // Arrange
    const a = 2;
    const b = 3;
    function sum(a, b) {
      return a + b;
    }
    // Act
    const result = sum(a, b);

    // Assert
    expect(result).toBe(5);
  });
});
