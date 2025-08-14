# Responsive Grid Layout System

A comprehensive responsive grid layout system for React applications that allows users to create, manage, and customize draggable and resizable grid layouts with individual sheets that maintain their original UI while being responsive to size changes.

## Key Features

### 🎯 **Preserved Original UI**
- **No UI Changes**: Sheets maintain their original visual appearance as seen on their respective full pages
- **Responsive Optimization**: Subtle adjustments to spacing, font sizes, and layout density based on available space
- **Original Components**: Uses the actual page components (DashboardPage, ProjectsPage, etc.) without modification

### 📱 **Responsive Design**
- **Size-Based Optimization**: Automatically adjusts content density based on sheet dimensions
- **Breakpoint Awareness**: Responsive behavior adapts to different screen sizes (lg, md, sm, xs, xxs)
- **Smooth Transitions**: CSS-based responsive adjustments with smooth transitions

### 🎮 **Interactive Grid Management**
- **Drag & Drop**: Intuitive drag and drop functionality for repositioning sheets
- **Resize Handles**: Visual resize handles for adjusting sheet dimensions
- **Zoom Controls**: Individual zoom controls for each sheet (zoom in, zoom out, reset)
- **Layout Persistence**: Automatic saving and loading of grid layouts using localStorage

### 🎨 **Visual Feedback**
- **Real-time Indicators**: Live display of current breakpoint, zoom level, and dimensions
- **Hover Effects**: Enhanced visual feedback during interactions
- **Status Badges**: Color-coded badges showing sheet status and information

### 🔌 **API Integration**
- **Task CRUD Operations**: Full create, read, update, delete functionality for tasks
- **REST API Support**: Integration with backend services via REST endpoints
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Validation**: Client-side validation with server-side confirmation

## How It Works

### Responsive Classes
The system applies CSS classes based on sheet dimensions:

- **`.responsive-compact`**: For small sheets (area < 12 grid units)
  - Reduced font sizes and spacing
  - Optimized for minimal space usage
  - Single-column layouts where appropriate

- **`.responsive-medium`**: For medium sheets (area < 24 grid units)
  - Moderate optimization
  - Balanced between space efficiency and readability

- **`.responsive-large`**: For large sheets (area >= 24 grid units)
  - Minimal changes to preserve original appearance
  - Full feature access

### Component Integration
Each sheet type renders its original component with responsive wrapper:

```typescript
// Example: Dashboard sheet
<div className={`h-full w-full ${responsiveClass}`}>
  <DashboardPage onOpenTab={onOpenTab} />
</div>
```

### CSS Responsive Adjustments
The system includes comprehensive CSS rules that automatically adjust:

- **Typography**: Font sizes, line heights, and spacing
- **Layout**: Grid columns, gaps, and padding
- **Interactive Elements**: Button sizes, input fields, and form controls
- **Tables**: Cell padding and font sizes
- **Cards**: Padding and border radius
- **Scrollbars**: Thinner scrollbars for compact views

## Usage

### Basic Implementation

```typescript
import ResponsiveGridDemo from './components/ResponsiveGridDemo';

export default function Home() {
  return <ResponsiveGridDemo />;
}
```

### API Integration

The system includes full API integration for task management:

#### Task Creation
```typescript
import { TaskApiService } from './utils/api';

// Create a new task
const taskData = {
  title: "New Task",
  description: "Task description",
  project: "Project Name",
  assignee: "John Doe",
  status: "To Do",
  priority: "Medium",
  startDate: "2024-01-01",
  dueDate: "2024-01-15",
  estimatedHours: 8,
  tags: "frontend,urgent",
  comments: "Initial comments"
};

const response = await TaskApiService.createTask(taskData);
if (response.success) {
  console.log("Task created:", response.data);
}
```

#### API Endpoints
- **Create Task**: `POST http://localhost:5001/crud?tableName=project-management-tasks`
- **Get Tasks**: `GET http://localhost:5001/crud?tableName=project-management-tasks`
- **Update Task**: `PUT http://localhost:5001/crud?tableName=project-management-tasks/{id}`
- **Delete Task**: `DELETE http://localhost:5001/crud?tableName=project-management-tasks/{id}`

#### Data Validation
The system includes comprehensive validation:
- Required field validation
- Date range validation
- Data type validation
- Server response validation

### Adding New Sheet Types

1. **Create the page component** (if it doesn't exist)
2. **Add to ResponsiveSheetContent.tsx**:

```typescript
case 'new-sheet-type':
  return (
    <div className={`h-full w-full ${responsiveClass}`}>
      <NewSheetTypePage 
        // Add required props
      />
    </div>
  );
```

3. **Update the sheet creation logic** in GridLayoutManager

### Customizing Responsive Behavior

Add custom CSS rules to `globals.css`:

```css
/* Custom responsive adjustments */
.responsive-compact .custom-element {
  font-size: 0.75rem;
  padding: 0.5rem;
}

.responsive-medium .custom-element {
  font-size: 0.875rem;
  padding: 0.75rem;
}

.responsive-large .custom-element {
  font-size: 1rem;
  padding: 1rem;
}
```

## Sheet-Specific Responsive Behaviors

### Dashboard
- **Compact**: Shows key stats in 2-column grid
- **Medium**: Full stats grid with activity feed
- **Large**: Complete dashboard with all features

### Projects
- **Compact**: Simplified project cards with essential info
- **Medium**: Standard project cards with progress bars
- **Large**: Full project details with all metadata

### Teams
- **Compact**: Team list with basic member count
- **Medium**: Team cards with member avatars
- **Large**: Complete team information with detailed member profiles

### Tasks
- **Compact**: Task list with priority indicators
- **Medium**: Task cards with progress and assignee info
- **Large**: Full task details with subtasks and comments

## Styling

### Responsive CSS Classes
The system includes comprehensive responsive styling:

```css
/* Typography adjustments */
.responsive-compact h1, .responsive-compact h2, .responsive-compact h3 {
  font-size: 0.875rem;
  line-height: 1.25;
  margin-bottom: 0.5rem;
}

/* Layout adjustments */
.responsive-compact .grid-cols-4 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Interactive elements */
.responsive-compact button {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
```

### Customization
- Modify responsive breakpoints in `getResponsiveClass()`
- Add custom responsive rules to `globals.css`
- Override specific component styles as needed

## Performance Optimizations

### CSS-Based Responsiveness
- **No JavaScript Calculations**: Responsive behavior handled entirely by CSS
- **Efficient Selectors**: Optimized CSS selectors for better performance
- **Minimal Re-renders**: Components only re-render when dimensions change

### Layout Persistence
- **localStorage**: Automatic saving of grid layouts
- **Debounced Updates**: Prevents excessive storage writes
- **Compressed Data**: Efficient storage format for layout data

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **CSS Grid**: Full support for CSS Grid layouts
- **CSS Custom Properties**: Used for responsive breakpoints
- **localStorage**: Required for layout persistence

## Accessibility

### Keyboard Navigation
- **Tab Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus handling during interactions
- **Screen Reader Support**: Semantic HTML and ARIA labels

### Visual Accessibility
- **High Contrast**: Maintains readability in all responsive modes
- **Scalable Text**: Font sizes remain readable at all scales
- **Touch Targets**: Adequate touch target sizes for mobile devices

## Future Enhancements

### Planned Features
- **Custom Breakpoints**: User-defined responsive breakpoints
- **Theme Support**: Dark mode and custom themes
- **Advanced Animations**: Smooth transitions between responsive states
- **Export/Import**: Layout sharing and backup functionality

### Potential Improvements
- **Performance Monitoring**: Real-time performance metrics
- **Accessibility Auditing**: Automated accessibility checks
- **Mobile Optimization**: Enhanced mobile-specific responsive behavior
- **Internationalization**: Multi-language support

## Troubleshooting

### Common Issues

**Sheets not resizing properly:**
- Check that responsive CSS classes are applied
- Verify breakpoint calculations in `getResponsiveClass()`

**Layout not saving:**
- Ensure localStorage is available and not blocked
- Check for storage quota exceeded errors

**Performance issues:**
- Reduce the number of sheets in the grid
- Optimize component rendering with React.memo
- Use CSS containment for complex components

### Debug Mode
Enable debug indicators to see responsive information:

```typescript
// In GridLayoutManager.tsx
<span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
  {width}×{height}
</span>
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly** with different screen sizes
5. **Submit a pull request**

## License

This project is licensed under the MIT License - see the LICENSE file for details.
