export class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    if (errors) this.errors = errors;
  }
}
