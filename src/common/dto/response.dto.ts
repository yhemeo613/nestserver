export class ResponseDto<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    statusCode: number;
    message: string;
    error: string;
    path?: string;
    timestamp?: string;
  };
  timestamp: string;

  private constructor(data: any) {
    Object.assign(this, data);
  }

  static success<T>(data?: T, message?: string): ResponseDto<T> {
    return new ResponseDto({
      success: true,
      data,
      message: message || '成功',
      timestamp: new Date().toISOString(),
    });
  }

  static error(error: {
    statusCode: number;
    message: string;
    error: string;
    path?: string;
    timestamp?: string;
  }): ResponseDto {
    return new ResponseDto({
      success: false,
      error,
      timestamp: error.timestamp || new Date().toISOString(),
    });
  }
}
