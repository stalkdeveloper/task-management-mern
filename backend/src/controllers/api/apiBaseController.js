class BaseController {
  constructor() {
    // Initialization logic can be added here if needed
  }

  /**
   * Send a successful response with status code.
   * @param {object} res - Express response object.
   * @param {object} data - Data to send in the response.
   * @param {string} message - Optional success message.
   * @param {number} statusCode - HTTP status code (default: 200).
   */
  sendResponse(res, data, message = 'Request successful', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      statusCode,
    });
  }

  /**
   * Send an error response with status code.
   * @param {object} res - Express response object.
   * @param {string} message - Error message.
   * @param {number} statusCode - HTTP status code (default: 400).
   * @param {object|string} error - Optional error object or details.
   */
  sendError(res, message = 'An error occurred', statusCode = 400, error = {}) {
    const errorMessage = typeof error === 'object' && error.message ? error.message : error;
    
    logError('Error:', errorMessage);

    return res.status(statusCode).json({
      success: false,
      message,
      error: errorMessage,
      statusCode,
    });
  }

  /**
   * Send an unauthorized response (status 401).
   * @param {object} res - Express response object.
   * @param {string} message - Unauthorized message.
   */
  unauthorized(res, message = 'Unauthorized access') {
    return this.sendError(res, message, 401);
  }

  /**
   * Send a forbidden response (status 403).
   * @param {object} res - Express response object.
   * @param {string} message - Forbidden message.
   */
  forbidden(res, message = 'Forbidden access') {
    return this.sendError(res, message, 403);
  }

  /**
   * Send a not found response (status 404).
   * @param {object} res - Express response object.
   * @param {string} message - Not found message.
   */
  notFound(res, message = 'Resource not found') {
    return this.sendError(res, message, 404);
  }

  /**
   * Send a bad request response (status 400).
   * @param {object} res - Express response object.
   * @param {string} message - Bad request message.
   */
  badRequest(res, message = 'Bad request') {
    return this.sendError(res, message, 400);
  }

  /**
   * Send a conflict response (status 409).
   * @param {object} res - Express response object.
   * @param {string} message - Conflict message.
   */
  conflict(res, message = 'Conflict occurred') {
    return this.sendError(res, message, 409);
  }

  /**
   * Send an internal server error response (status 500).
   * @param {object} res - Express response object.
   * @param {string} message - Internal server error message.
   */
  internalServerError(res, message = 'Internal server error') {
    return this.sendError(res, message, 500);
  }
}

module.exports = BaseController;
