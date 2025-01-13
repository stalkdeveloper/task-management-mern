module.exports = {
    ERROR_CODES: {
        // Informational Responses (100–199)
        CONTINUE: 100,                    // The server has received the request and the client should continue sending the request.
        SWITCHING_PROTOCOLS: 101,         // The server is switching protocols as requested by the client.
        PROCESSING: 102,                  // The server is processing the request, but no response is available yet (WebDAV).

        // Successful Responses (200–299)
        OK: 200,                          // The request has succeeded.
        CREATED: 201,                     // The request has been fulfilled and a new resource has been created.
        ACCEPTED: 202,                    // The request has been accepted for processing, but the processing is not complete.
        NON_AUTHORITATIVE_INFORMATION: 203, // The returned metadata is not the definitive set of metadata.
        NO_CONTENT: 204,                  // The server has fulfilled the request, but there is no content to send in the response.
        RESET_CONTENT: 205,               // The server has fulfilled the request, but there is no content to return.
        PARTIAL_CONTENT: 206,             // The server is delivering only part of the resource due to a range header sent by the client.

        // Redirection Messages (300–399)
        MULTIPLE_CHOICES: 300,            // There are multiple choices for the resource, and the client must choose one.
        MOVED_PERMANENTLY: 301,           // The resource has been permanently moved to a new URL.
        FOUND: 302,                       // The resource was found, but it resides at a different URL temporarily.
        SEE_OTHER: 303,                   // The response to the request can be found under a different URL using the GET method.
        NOT_MODIFIED: 304,                // The resource has not been modified since the last request.
        USE_PROXY: 305,                   // The requested resource must be accessed through a proxy.
        TEMPORARY_REDIRECT: 307,          // The resource has temporarily moved to a different URL.
        PERMANENT_REDIRECT: 308,          // The resource has permanently moved to a new URL.

        // Client Error Responses (400–499)
        BAD_REQUEST: 400,                 // The server cannot process the request due to client error (e.g., malformed request).
        UNAUTHORIZED: 401,                // Authentication is required and has failed or has not been provided.
        PAYMENT_REQUIRED: 402,            // Payment is required for the resource.
        FORBIDDEN: 403,                   // The server understands the request, but it refuses to authorize it.
        NOT_FOUND: 404,                   // The requested resource could not be found on the server.
        METHOD_NOT_ALLOWED: 405,          // The method specified in the request is not allowed for the resource.
        NOT_ACCEPTABLE: 406,              // The resource is not acceptable according to the accept headers sent in the request.
        PROXY_AUTHENTICATION_REQUIRED: 407, // The client must authenticate itself with the proxy.
        REQUEST_TIMEOUT: 408,             // The server timed out waiting for the request from the client.
        CONFLICT: 409,                    // The request could not be completed due to a conflict with the current state of the resource.
        GONE: 410,                        // The requested resource is no longer available and has been permanently removed.
        LENGTH_REQUIRED: 411,             // The request did not specify the length of its content.
        PRECONDITION_FAILED: 412,         // One or more conditions in the request header fields were not met.
        PAYLOAD_TOO_LARGE: 413,           // The request entity is larger than the server is willing or able to process.
        URI_TOO_LONG: 414,                // The URI requested by the client is too long for the server to process.
        UNSUPPORTED_MEDIA_TYPE: 415,      // The media type of the request is not supported by the server.
        RANGE_NOT_SATISFIABLE: 416,       // The client has asked for a portion of the file, but the server cannot supply that portion.
        EXPECTATION_FAILED: 417,          // The server cannot meet the requirements of the Expect request header.
        I_AM_A_TEAPOT: 418,               // (April Fools' joke) The server is a teapot and cannot brew coffee.
        MISDIRECTED_REQUEST: 421,         // The request was directed to a server that is not able to produce a response.
        UNPROCESSABLE_ENTITY: 422,        // The server understands the content type of the request entity, but it cannot process the contained instructions.
        LOCKED: 423,                      // The resource that is being accessed is locked.
        FAILED_DEPENDENCY: 424,           // The request failed due to failure of a previous request (WebDAV).
        UPGRADE_REQUIRED: 426,            // The client should switch to a different protocol.
        PRECONDITION_REQUIRED: 428,       // The server requires the request to be conditional.
        TOO_MANY_REQUESTS: 429,           // The user has sent too many requests in a given amount of time.
        REQUEST_HEADER_FIELDS_TOO_LARGE: 431, // The request's header fields are too large.
        UNAVAILABLE_FOR_LEGAL_REASONS: 451, // The resource is unavailable due to legal reasons.

        // Server Error Responses (500–599)
        INTERNAL_SERVER_ERROR: 500,       // A generic error message when the server encounters an unexpected condition.
        NOT_IMPLEMENTED: 501,             // The server does not support the functionality required to fulfill the request.
        BAD_GATEWAY: 502,                 // The server received an invalid response from the upstream server.
        SERVICE_UNAVAILABLE: 503,         // The server is currently unable to handle the request due to temporary overload or maintenance.
        GATEWAY_TIMEOUT: 504,             // The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.
        HTTP_VERSION_NOT_SUPPORTED: 505,  // The server does not support the HTTP protocol version that was used in the request.
        VARIANT_ALSO_NEGOTIATES: 506,     // The server encountered an error while negotiating content for the resource.
        INSUFFICIENT_STORAGE: 507,        // The server is unable to store the representation needed to complete the request (WebDAV).
        LOOP_DETECTED: 508,               // The server detected an infinite loop while processing the request (WebDAV).
        NOT_EXTENDED: 510,                // Further extensions to the request are required to fulfill it.
        NETWORK_AUTHENTICATION_REQUIRED: 511 // The client must authenticate to gain network access.
    }
};
  