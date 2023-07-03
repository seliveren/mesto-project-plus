class ConflictError extends Error {
  private statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
