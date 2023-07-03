class BadRequest extends Error {
  private statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequest;
