export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  success: false;
  message: string;
  errors: ValidationErrorDetail[];
}
