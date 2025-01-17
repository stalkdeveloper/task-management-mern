global.constants = {
    USER_STATUS: [
        'active',
        'inactive',
        'suspended',
        'closed',
        'pending'
    ],

    USER_VERIFICATION_STATUS: [
        'unverified',
        'pending',
        'verified',
        'blocked'
    ],
    
    PROJECT_STATUS: [
        'active',
        'completed',
        'on_hold',
        'in_progress'
    ],
  
    TASK_STATUS: [
        'open',
        'in_progress',
        'completed',
        'on_hold',
        'cancelled'
    ],
  
    USER_ROLES: [
        'superadmin',
        'admin',
        'user',
        'guest'
    ],
  

    APP_MODES: [
        'development',
        'production',
        'staging',    
        'testing',
    ],
  
    FILE_STATUS: [
        'uploaded',
        'processing',
        'completed',
        'failed'
    ],
  
    DATE_FORMAT: [
        'YYYY-MM-DD',
        'YYYY-MM-DD HH:mm:ss',
        'MM/DD/YYYY',
        'DD-MM-YYYY',
        'dddd, MMMM Do YYYY'
    ],
  
    TIMEZONES: [
        'UTC',
    ],
  
    FLAGS: {
        TRUE: true,
        FALSE: false
    },

    URL: {
        baseUrl: `http://localhost:3000/`
    }
};
  
  