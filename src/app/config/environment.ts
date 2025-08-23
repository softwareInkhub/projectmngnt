// ========================================
// ENVIRONMENT CONFIGURATION
// ========================================

export interface EnvironmentConfig {
  // API Configuration
  apiBaseUrl: string;
  
  // AWS DynamoDB Configuration
  awsRegion: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  
  // DynamoDB Table Names
  dynamodbTables: {
    companies: string;
    tasks: string;
    projects: string;
    teams: string;
    sprints: string;
    stories: string;
  };
  
  // Application Configuration
  appName: string;
  appVersion: string;
  debugMode: boolean;
  
  // Feature Flags
  enableAnalytics: boolean;
  enableNotifications: boolean;
  enableRealTimeUpdates: boolean;
  
  // Environment
  isDevelopment: boolean;
  isProduction: boolean;
}

// Environment validation
function validateEnvironment(): void {
  const requiredVars = [
    'NEXT_PUBLIC_API_BASE_URL',
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    console.warn('Please check your .env.local file');
  }
}

// Get environment configuration
export function getEnvironmentConfig(): EnvironmentConfig {
  // Validate environment on first load
  if (typeof window === 'undefined') {
    validateEnvironment();
  }

  return {
    // API Configuration
    apiBaseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in',
    
    // AWS DynamoDB Configuration
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    
    // DynamoDB Table Names
    dynamodbTables: {
      companies: process.env.NEXT_PUBLIC_DYNAMODB_COMPANIES_TABLE || 'project-management-companies',
      tasks: process.env.NEXT_PUBLIC_DYNAMODB_TASKS_TABLE || 'project-management-tasks',
      projects: process.env.NEXT_PUBLIC_DYNAMODB_PROJECTS_TABLE || 'project-management-projects',
      teams: process.env.NEXT_PUBLIC_DYNAMODB_TEAMS_TABLE || 'project-management-teams',
      sprints: process.env.NEXT_PUBLIC_DYNAMODB_SPRINTS_TABLE || 'project-management-sprints',
      stories: process.env.NEXT_PUBLIC_DYNAMODB_STORIES_TABLE || 'project-management-stories',
    },
    
    // Application Configuration
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Project Management System',
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' || process.env.NODE_ENV === 'development',
    
    // Feature Flags
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
    enableRealTimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES === 'true',
    
    // Environment
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  };
}

// Export singleton instance
export const env = getEnvironmentConfig();

// Export table names for convenience
export const TABLE_NAMES = env.dynamodbTables;
