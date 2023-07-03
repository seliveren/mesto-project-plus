class ForbiddenError extends Error {
  private statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
