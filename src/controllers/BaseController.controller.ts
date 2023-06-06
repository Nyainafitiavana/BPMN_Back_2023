import { ApiResponse } from '@interfaces/response.interface';

class BaseController {
  protected response(success: boolean, message?: string, rows?: object[] | object, totalRows?: number, limit?: number, page?: number): ApiResponse {
    const response: ApiResponse = {
      success: success,
      message: message,
      data: {
        totalRows: totalRows,
        limit: limit,
        page: page,
        rows: rows,
      },
    };

    return response;
  }
}

export default BaseController;
