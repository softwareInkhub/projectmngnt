// Vercel serverless function for CRUD operations
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { tableName, id } = req.query;
    
    if (!tableName) {
      return res.status(400).json({ error: 'Table name is required' });
    }

    switch (req.method) {
      case 'GET':
        if (id) {
          // Get specific item
          const getCommand = new GetCommand({
            TableName: tableName,
            Key: { id }
          });
          const result = await docClient.send(getCommand);
          return res.status(200).json(result.Item || {});
        } else {
          // Get all items
          const scanCommand = new ScanCommand({
            TableName: tableName
          });
          const result = await docClient.send(scanCommand);
          return res.status(200).json(result.Items || []);
        }

      case 'POST':
        const { item } = req.body;
        if (!item) {
          return res.status(400).json({ error: 'Item is required' });
        }

        const putCommand = new PutCommand({
          TableName: tableName,
          Item: item
        });
        await docClient.send(putCommand);
        return res.status(200).json({ success: true, id: item.id });

      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'ID is required for updates' });
        }

        const updateCommand = new UpdateCommand({
          TableName: tableName,
          Key: { id },
          UpdateExpression: 'SET #title = :title, #description = :description, #project = :project, #assignee = :assignee, #status = :status, #priority = :priority, #startDate = :startDate, #dueDate = :dueDate, #estimatedHours = :estimatedHours, #tags = :tags, #subtasks = :subtasks, #comments = :comments, #updatedAt = :updatedAt',
          ExpressionAttributeNames: {
            '#title': 'title',
            '#description': 'description',
            '#project': 'project',
            '#assignee': 'assignee',
            '#status': 'status',
            '#priority': 'priority',
            '#startDate': 'startDate',
            '#dueDate': 'dueDate',
            '#estimatedHours': 'estimatedHours',
            '#tags': 'tags',
            '#subtasks': 'subtasks',
            '#comments': 'comments',
            '#updatedAt': 'updatedAt'
          },
          ExpressionAttributeValues: {
            ':title': req.body.title || '',
            ':description': req.body.description || '',
            ':project': req.body.project || '',
            ':assignee': req.body.assignee || '',
            ':status': req.body.status || '',
            ':priority': req.body.priority || '',
            ':startDate': req.body.startDate || '',
            ':dueDate': req.body.dueDate || '',
            ':estimatedHours': req.body.estimatedHours || 0,
            ':tags': req.body.tags || '',
            ':subtasks': req.body.subtasks || '',
            ':comments': req.body.comments || '',
            ':updatedAt': new Date().toISOString()
          }
        });
        await docClient.send(updateCommand);
        return res.status(200).json({ success: true });

      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'ID is required for deletion' });
        }

        const deleteCommand = new DeleteCommand({
          TableName: tableName,
          Key: { id }
        });
        await docClient.send(deleteCommand);
        return res.status(200).json({ success: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
