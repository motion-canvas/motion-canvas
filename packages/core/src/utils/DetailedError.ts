export class DetailedError extends Error {
  public constructor(message: string, public readonly remarks?: string) {
    super(message);
  }
}
