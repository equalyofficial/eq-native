export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export class ApiError extends Error {
  readonly code: string;
  readonly details?: ApiErrorDetail[];

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.code = body.code;
    this.details = body.details;
  }

  /** Returns the first validation message for a specific field, if any. */
  fieldError(field: string): string | undefined {
    return this.details?.find((d) => d.field === field)?.message;
  }
}

export function parseApiError(raw: unknown): ApiError {
  if (
    raw &&
    typeof raw === "object" &&
    "error" in raw &&
    raw.error &&
    typeof raw.error === "object" &&
    "code" in raw.error &&
    "message" in raw.error
  ) {
    return new ApiError(raw.error as ApiErrorBody);
  }
  return new ApiError({
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred.",
  });
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}
