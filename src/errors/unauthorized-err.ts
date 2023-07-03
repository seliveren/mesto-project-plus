class UnauthorizedError extends Error {
  private statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
