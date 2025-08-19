// DynamoDB Configuration
// Copy this file to .env.local and update with your actual AWS credentials

module.exports = {
  // API Configuration
  NEXT_PUBLIC_API_URL: process.env. || 'http://localhost:5001',
  
  // AWS DynamoDB Configuration
  AWS_REGION: 'us-east-1',
  AWS_ACCESS_KEY_ID: 'your-access-key-id', // Replace with your actual AWS access key
  AWS_SECRET_ACCESS_KEY: 'your-secret-access-key', // Replace with your actual AWS secret key
  
  // DynamoDB Table Names
  DYNAMODB_COMPANIES_TABLE: 'project-management-companies',
  DYNAMODB_TASKS_TABLE: 'project-management-tasks',
  
  // Table Schema for Tasks
  TASKS_TABLE_SCHEMA: {
    TableName: 'project-management-tasks',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  
  // Table Schema for Companies
  COMPANIES_TABLE_SCHEMA: {
    TableName: 'project-management-companies',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
};

/*
SETUP INSTRUCTIONS:

1. Create AWS DynamoDB Tables:
   - Go to AWS Console > DynamoDB
   - Create table: project-management-tasks
   - Create table: project-management-companies
   - Use 'id' as the partition key (String type)

2. Set up AWS Credentials:
   - Create an IAM user with DynamoDB permissions
   - Get Access Key ID and Secret Access Key
   - Update the values above

3. Environment Variables:
   - Copy this configuration to .env.local
   - Update with your actual AWS credentials

4. Test the Setup:
   - Run: node api/server.js
   - Test API endpoints with curl or Postman
*/
