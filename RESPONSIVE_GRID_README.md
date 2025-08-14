# Responsive Grid Layout System

## Overview

The Responsive Grid Layout System provides an intelligent, adaptive interface where sheet content automatically optimizes based on available space and device breakpoints. Each sheet intelligently adjusts its UI components, content density, and interaction patterns to provide the best user experience regardless of size.

## Key Features

### 🎯 Smart Content Adaptation
- **Small sheets** (3×4 or smaller): Compact view with expand/collapse functionality
- **Medium sheets** (4×6 or smaller): Essential content with basic actions
- **Large sheets** (6×4 or larger): Full content with all features and detailed information

### 📱 Breakpoint Awareness
- **Mobile** (xs, xxs): Optimized for touch interactions and limited space
- **Tablet** (sm, md): Balanced layout with moderate content density
- **Desktop** (lg): Full-featured interface with maximum information density

### 🔄 Dynamic UI Components
- **Headers**: Show/hide based on available space
- **Search bars**: Appear only when there's sufficient width
- **Action buttons**: Scale from full buttons to icons based on space
- **Data tables**: Transform to cards or lists for smaller spaces
- **Charts**: Adapt from full charts to simplified metrics

## How It Works

### 1. Dimension Calculation
```typescript
const area = width * height;
const isSmall = area < 12;    // 3x4 or smaller
const isMedium = area < 24;   // 4x6 or smaller
const isLarge = area >= 24;   // 6x4 or larger
```

### 2. Responsive Configuration
```typescript
const responsiveConfig = {
  showHeader: !isSmall || isExpanded,
  showSearch: isMedium || isLarge,
  showFilters: isLarge,
  showActions: isMedium || isLarge,
  showStats: isMedium || isLarge,
  showDetails: isLarge,
  showCharts: isLarge,
  compactMode: isSmall && !isExpanded,
  cardSize: isSmall ? 'small' : isMedium ? 'medium' : 'large',
  itemsPerPage: isSmall ? 3 : isMedium ? 6 : 12
};
```

### 3. Content Rendering
Each sheet type has specialized rendering logic:
- **Dashboard**: Stats cards, quick actions, recent activity
- **Projects**: Project list with progress bars and status
- **Teams**: Team cards with member counts and project info
- **Tasks**: Task list with priorities and assignees
- **Calendar**: Event list or calendar view
- **Reports**: Charts and metrics
- **Notifications**: Notification feed
- **Settings**: Quick settings or full options

## Usage Examples

### Basic Implementation
```tsx
import ResponsiveSheetContent from './ResponsiveSheetContent';

<ResponsiveSheetContent
  sheetType="dashboard"
  sheetTitle="Dashboard"
  width={6}
  height={4}
  breakpoint="lg"
  onOpenTab={handleOpenTab}
/>
```

### Grid Layout Integration
```tsx
import GridLayoutManager from './GridLayoutManager';

<GridLayoutManager
  onOpenTab={handleOpenTab}
  draggedItem={draggedItem}
  onDropItem={handleDropItem}
/>
```

## Sheet Types and Their Responsive Behavior

### Dashboard Sheet
- **Small**: Icon + title with expand/collapse
- **Medium**: 2-4 key stats in compact cards
- **Large**: Full stats grid + quick actions + recent activity

### Projects Sheet
- **Small**: Project count with expand/collapse
- **Medium**: Project list with basic info (name, progress)
- **Large**: Full project list with search, filters, and detailed info

### Teams Sheet
- **Small**: Team count with expand/collapse
- **Medium**: Team cards with member counts
- **Large**: Full team list with member details and project info

### Tasks Sheet
- **Small**: Task count with expand/collapse
- **Medium**: Task list with priorities
- **Large**: Full task list with search, filters, and assignee details

### Calendar Sheet
- **Small**: Event count with expand/collapse
- **Medium**: Today's events list
- **Large**: Full calendar view with navigation

### Reports Sheet
- **Small**: Key metrics with expand/collapse
- **Medium**: Basic charts and metrics
- **Large**: Full dashboard with multiple charts and detailed analytics

### Notifications Sheet
- **Small**: Notification count with expand/collapse
- **Medium**: Recent notifications list
- **Large**: Full notification feed with filters and actions

### Settings Sheet
- **Small**: Settings icon with expand/collapse
- **Medium**: Quick settings list
- **Large**: Full settings interface with categories

## CSS Classes and Styling

### Responsive Classes
```css
.responsive-sheet-compact     /* Compact mode styling */
.responsive-card-small        /* Small card styling */
.responsive-card-medium       /* Medium card styling */
.responsive-card-large        /* Large card styling */
```

### Animation Classes
```css
.responsive-sheet-enter       /* Enter animation */
.responsive-sheet-enter-active
.responsive-sheet-exit        /* Exit animation */
.responsive-sheet-exit-active
```

### Utility Classes
```css
.line-clamp-2                /* Text truncation */
.line-clamp-3
.scrollbar-thin              /* Custom scrollbars */
```

## Performance Optimizations

### 1. Memoized Calculations
```typescript
const responsiveConfig = useMemo(() => {
  // Calculate responsive configuration
}, [width, height, breakpoint, isExpanded]);
```

### 2. Conditional Rendering
```typescript
{responsiveConfig.showStats && <StatsSection />}
{responsiveConfig.showSearch && <SearchBar />}
```

### 3. Efficient Updates
- Only re-render when dimensions or breakpoint changes
- Use React.memo for expensive components
- Lazy load content for large sheets

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Logical tab order and focus indicators
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user's motion preferences

## Future Enhancements

### Planned Features
- **AI-powered content prioritization**: Automatically determine what content to show based on user behavior
- **Gesture support**: Touch gestures for mobile devices
- **Voice commands**: Voice control for sheet operations
- **Advanced animations**: More sophisticated transition effects
- **Custom themes**: User-defined responsive breakpoints and styling

### Performance Improvements
- **Virtual scrolling**: For large datasets in small sheets
- **Progressive loading**: Load content as sheets are resized
- **Caching**: Cache rendered content for faster resizing
- **Web Workers**: Offload calculations to background threads

## Troubleshooting

### Common Issues

1. **Sheets not resizing properly**
   - Check that the grid layout is properly configured
   - Verify that responsive breakpoints are set correctly
   - Ensure CSS is loaded properly

2. **Content not adapting to size**
   - Verify that ResponsiveSheetContent is being used
   - Check that width and height props are being passed correctly
   - Ensure breakpoint detection is working

3. **Performance issues with many sheets**
   - Consider using React.memo for sheet components
   - Implement virtual scrolling for large datasets
   - Optimize responsive calculations

### Debug Mode
Enable debug mode to see responsive configuration:
```typescript
const debugMode = process.env.NODE_ENV === 'development';
```

## Contributing

When contributing to the responsive grid system:

1. **Test across all breakpoints**: Ensure your changes work on mobile, tablet, and desktop
2. **Consider performance**: Optimize for smooth resizing and transitions
3. **Maintain accessibility**: Ensure all features are keyboard and screen reader accessible
4. **Follow responsive patterns**: Use the established responsive configuration system
5. **Add documentation**: Document any new responsive behaviors or configurations

## License

This responsive grid layout system is part of the project management application and follows the same licensing terms. 