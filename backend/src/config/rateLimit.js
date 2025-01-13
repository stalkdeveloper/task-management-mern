module.exports = {
    RATE_LIMIT: {
        WINDOW_SIZE: 60,       /* Time window in seconds (e.g., 60 seconds = 1 minute) */
        MAX_REQUESTS: 5,       /* Max requests per time window */
        PENALTY_TIME: 3600,    /* Time (in seconds) to block requests after exceeding the limit (e.g., 1 hour) */
    }
};
  