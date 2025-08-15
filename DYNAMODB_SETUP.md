# DynamoDB Integration Setup Guide

## Overview
This project now uses your existing external server at `http://54.85.164.84:5001` for all CRUD operations with DynamoDB. The frontend has been updated to communicate directly with your server.

## ✅ What's Been Fixed

### 1. **API Architecture Issues Fixed:**
- ✅ **Consistent API endpoints**: All frontend components now use `http://54.85.164.84:5001`
- ✅ **Task API service**: Created comprehensive `TaskApiService` with proper TypeScript interfaces
- ✅ **Data structure consistency**: Unified `TaskData` and `TaskWithUI` interfaces
- ✅ **Proper validation**: Complete validation functions for all data types

### 2. **DynamoDB Integration:**
- ✅ **External server connection**: Frontend connects to your existing server
- ✅ **Proper request format**: All requests wrapped in `{ item: data }` format
- ✅ **ID generation**: Automatic ID generation for new items
- ✅ **Error handling**: Comprehensive error handling and fallbacks

### 3. **Component Updates:**
- ✅ **TasksPage**: Updated to use `TaskApiService` instead of hardcoded URLs
- ✅ **CreateTaskModal**: Updated to use new API service
- ✅ **ContextSidebar**: Maintains existing functionality
- ✅ **All CRUD operations**: Create, Read, Update, Delete working

## 🚀 Quick Start

### 1. **Start the Development Server**
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### 2. **Test the API Connection**
```bash
node test-api.js
```
This will test all CRUD operations with your external server.

## 📁 File Structure

### API Services
- `src/app/utils/api.ts` - Generic CRUD operations
- `src/app/utils/taskApi.ts` - Task-specific API service
- `src/app/utils/companyApi.ts` - Company-specific API service

### Components Updated
- `src/app/components/TasksPage.tsx` - Main tasks page
- `src/app/components/CreateTaskModal.tsx` - Task creation modal
- `src/app/components/ContextSidebar.tsx` - Context sidebar

### Configuration
- `config/dynamodb.config.js` - Configuration reference
- `test-api.js` - API testing script

## 🔧 API Endpoints Used

### Tasks (`project-management-tasks` table)
- **POST** `/crud?tableName=project-management-tasks` - Create task
- **GET** `/crud?tableName=project-management-tasks` - Get all tasks
- **PUT** `/crud?tableName=project-management-tasks&id={id}` - Update task
- **DELETE** `/crud?tableName=project-management-tasks&id={id}` - Delete task

### Companies (`project-management-companies` table)
- **POST** `/crud?tableName=project-management-companies` - Create company
- **GET** `/crud?tableName=project-management-companies` - Get all companies
- **PUT** `/crud?tableName=project-management-companies&id={id}` - Update company
- **DELETE** `/crud?tableName=project-management-companies&id={id}` - Delete company

## 📊 Data Structures

### TaskData Interface
```typescript
interface TaskData {
  id?: string;
  title: string;
  description: string;
  project: string;
  assignee: string;
  status: string;
  priority: string;
  dueDate: string;
  startDate: string;
  estimatedHours: number;
  tags: string;
  subtasks: string;
  comments: string;
  progress?: number;
  timeSpent?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### CompanyData Interface
```typescript
interface CompanyData {
  id?: string;
  name: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  founded?: string;
  revenue?: string;
  employees?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## 🧪 Testing

### Manual Testing
1. Open `http://localhost:3000` in your browser
2. Navigate to the Tasks page
3. Try creating, editing, and deleting tasks
4. Check the browser console for API responses

### Automated Testing
```bash
node test-api.js
```

## 🔍 Troubleshooting

### Common Issues

1. **"Item is required" error**
   - Solution: All requests are now properly wrapped in `{ item: data }` format

2. **"Missing partition key: id" error**
   - Solution: IDs are now automatically generated for new items

3. **"Both key and updates are required" error**
   - Solution: Update requests are properly formatted

4. **CORS issues**
   - Solution: Your external server should have CORS enabled

### Debug Mode
Enable debug logging by checking the browser console for API request/response details.

## 📈 Performance

- **API Calls**: Optimized to use your existing server
- **Data Transformation**: Efficient transformation between API and UI formats
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Caching**: Browser-level caching for GET requests

## 🔮 Future Enhancements

1. **Real-time Updates**: WebSocket integration for live updates
2. **Offline Support**: Service worker for offline functionality
3. **Advanced Filtering**: Server-side filtering and pagination
4. **Bulk Operations**: Batch create/update/delete operations

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Run `node test-api.js` to verify API connectivity
3. Ensure your external server is running and accessible
4. Verify DynamoDB table permissions and structure

---

**Status**: ✅ **FULLY INTEGRATED AND TESTED**
**Last Updated**: December 2024
**Server**: `http://54.85.164.84:5001`
**Tables**: `project-management-tasks`, `project-management-companies`
