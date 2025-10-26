export class ApiResponseDTO<T> {
  private constructor(
    public success: boolean,
    public data: T | null,
    public error: string | null
  ) {}

  public static ofSuccess<T>(data: T): ApiResponseDTO<T> {
    return new ApiResponseDTO<T>(true, data, null);
  }

  public static ofError(message: string): ApiResponseDTO<null> {
    return new ApiResponseDTO<null>(false, null, message);
  }

  public toJSON() {
    const json: Record<string, any> = { success: this.success };

    if (this.data !== null) json.data = this.data;
    if (this.error !== null) json.error = this.error;

    return json;
  }
}
