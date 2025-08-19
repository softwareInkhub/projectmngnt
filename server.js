// ========================================
// LOCAL BACKEND SERVER FOR PROJECT MANAGEMENT
// ========================================

const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// AWS DynamoDB Configuration
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key-id',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-access-key',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Project Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Generic CRUD endpoint
app.all('/crud', async (req, res) => {
  try {
    const { tableName, action, id } = req.query;
    const method = req.method;

    console.log(`[${method}] /crud - Table: ${tableName}, Action: ${action}, ID: ${id}`);

    if (!tableName) {
      return res.status(400).json({ 
        success: false, 
        error: 'tableName parameter is required' 
      });
    }

    // GET - Fetch all items or single item
    if (method === 'GET') {
      if (id) {
        // Get single item
        const command = new GetCommand({
          TableName: tableName,
          Key: { id: id }
        });

        const result = await docClient.send(command);
        console.log('GET single item result:', result);

        if (result.Item) {
          res.json({ success: true, data: result.Item });
        } else {
          res.status(404).json({ success: false, error: 'Item not found' });
        }
      } else {
        // Get all items
        const command = new ScanCommand({
          TableName: tableName
        });

        const result = await docClient.send(command);
        console.log('GET all items result:', result);

        res.json({ 
          success: true, 
          data: result.Items || [],
          count: result.Count || 0
        });
      }
    }

    // POST - Create new item
    else if (method === 'POST') {
      const { item } = req.body;

      if (!item) {
        return res.status(400).json({ 
          success: false, 
          error: 'item is required in request body' 
        });
      }

      // Ensure item has an ID
      if (!item.id) {
        item.id = `${tableName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      // Add timestamps
      item.createdAt = item.createdAt || new Date().toISOString();
      item.updatedAt = new Date().toISOString();

      const command = new PutCommand({
        TableName: tableName,
        Item: item
      });

      const result = await docClient.send(command);
      console.log('POST create item result:', result);

      res.json({ 
        success: true, 
        data: item,
        id: item.id,
        message: 'Item created successfully'
      });
    }

    // PUT - Update item
    else if (method === 'PUT') {
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'id parameter is required for updates' 
        });
      }

      const { key, updates } = req.body;

      if (!updates) {
        return res.status(400).json({ 
          success: false, 
          error: 'updates are required in request body' 
        });
      }

      // Add updated timestamp
      updates.updatedAt = new Date().toISOString();

      const updateExpression = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.keys(updates).forEach(key => {
        const attributeName = `#${key}`;
        const attributeValue = `:${key}`;
        
        updateExpression.push(`${attributeName} = ${attributeValue}`);
        expressionAttributeNames[attributeName] = key;
        expressionAttributeValues[attributeValue] = updates[key];
      });

      const command = new UpdateCommand({
        TableName: tableName,
        Key: { id: id },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      });

      const result = await docClient.send(command);
      console.log('PUT update item result:', result);

      res.json({ 
        success: true, 
        data: result.Attributes,
        message: 'Item updated successfully'
      });
    }

    // DELETE - Delete item
    else if (method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'id parameter is required for deletion' 
        });
      }

      const command = new DeleteCommand({
        TableName: tableName,
        Key: { id: id }
      });

      const result = await docClient.send(command);
      console.log('DELETE item result:', result);

      res.json({ 
        success: true, 
        message: 'Item deleted successfully'
      });
    }

    else {
      res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
      });
    }

  } catch (error) {
    console.error('CRUD operation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Project Management API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 CORS enabled for all origins`);
  
  // Log AWS configuration
  console.log(`🔑 AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);
  console.log(`🔑 AWS Access Key: ${process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set'}`);
  console.log(`🔑 AWS Secret Key: ${process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set'}`);
});

module.exports = app;
