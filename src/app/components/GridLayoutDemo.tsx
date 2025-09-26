// 'use client';

// import React, { useState } from 'react';
// import GridLayoutWrapper from './GridLayoutWrapper';
// import { 
//   BarChart3, 
//   PieChart, 
//   TrendingUp, 
//   Users, 
//   Calendar, 
//   FileText, 
//   MessageSquare, 
//   Bell,
//   Settings,
//   Grid3X3,
//   Plus,
//   Download,
//   Upload,
//   RotateCcw
// } from 'lucide-react';

// // Demo widget components
// const ChartWidget = ({ title, data, color }: any) => (
//   <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
//     <div className="flex items-center gap-2 mb-4">
//       <BarChart3 size={16} className="text-blue-600" />
//       <h3 className="font-semibold text-gray-900">{title}</h3>
//     </div>
//     <div className="space-y-2">
//       {data.map((item: any, index: number) => (
//         <div key={`demo-${index}`} className="flex items-center justify-between">
//           <span className="text-sm text-gray-600">{item.label}</span>
//           <div className="flex items-center gap-2">
//             <div className="w-16 bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`h-full ${color} rounded-full`}
//                 style={{ width: `${item.value}%` }}
//               />
//             </div>
//             <span className="text-sm font-medium text-gray-900">{item.value}%</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const StatsWidget = ({ title, value, change, icon: Icon, color }: any) => (
//   <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
//     <div className="flex items-center justify-between mb-3">
//       <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
//         <Icon size={16} className="text-white" />
//       </div>
//       <span className={`text-xs font-medium ${
//         change > 0 ? 'text-green-600' : 'text-red-600'
//       }`}>
//         {change > 0 ? '+' : ''}{change}%
//       </span>
//     </div>
//     <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
//     <div className="text-sm text-gray-600">{title}</div>
//   </div>
// );

// const ActivityWidget = ({ activities }: any) => (
//   <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
//     <div className="flex items-center gap-2 mb-4">
//       <MessageSquare size={16} className="text-green-600" />
//       <h3 className="font-semibold text-gray-900">Recent Activity</h3>
//     </div>
//     <div className="space-y-3">
//       {activities.map((activity: any, index: number) => (
//         <div key={`demo-${index}`} className="flex items-start gap-3">
//           <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold flex items-center justify-center">
//             {activity.avatar}
//           </div>
//           <div className="flex-1">
//             <div className="text-sm font-medium text-gray-900">{activity.user}</div>
//             <div className="text-xs text-gray-600">{activity.action}</div>
//             <div className="text-xs text-gray-400">{activity.time}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const CalendarWidget = ({ events }: any) => (
//   <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
//     <div className="flex items-center gap-2 mb-4">
//       <Calendar size={16} className="text-purple-600" />
//       <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
//     </div>
//     <div className="space-y-3">
//       {events.map((event: any, index: number) => (
//         <div key={`demo-${index}`} className="flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-blue-500"></div>
//           <div className="flex-1">
//             <div className="text-sm font-medium text-gray-900">{event.title}</div>
//             <div className="text-xs text-gray-600">{event.date}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const NotificationsWidget = ({ notifications }: any) => (
//   <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
//     <div className="flex items-center gap-2 mb-4">
//       <Bell size={16} className="text-orange-600" />
//       <h3 className="font-semibold text-gray-900">Notifications</h3>
//     </div>
//     <div className="space-y-3">
//       {notifications.map((notification: any, index: number) => (
//         <div key={`demo-${index}`} className="flex items-start gap-3">
//           <div className={`w-2 h-2 rounded-full mt-2 ${
//             notification.type === 'success' ? 'bg-green-500' :
//             notification.type === 'warning' ? 'bg-yellow-500' :
//             'bg-blue-500'
//           }`}></div>
//           <div className="flex-1">
//             <div className="text-sm text-gray-700">{notification.message}</div>
//             <div className="text-xs text-gray-400">{notification.time}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const SettingsWidget = () => (
//   <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
//     <div className="flex items-center gap-2 mb-4">
//       <Settings size={16} className="text-gray-600" />
//       <h3 className="font-semibold text-gray-900">Quick Settings</h3>
//     </div>
//     <div className="space-y-3">
//       <div className="flex items-center justify-between">
//         <span className="text-sm text-gray-700">Dark Mode</span>
//         <div className="w-10 h-6 bg-gray-200 rounded-full relative">
//           <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
//         </div>
//       </div>
//       <div className="flex items-center justify-between">
//         <span className="text-sm text-gray-700">Notifications</span>
//         <div className="w-10 h-6 bg-blue-500 rounded-full relative">
//           <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
//         </div>
//       </div>
//       <div className="flex items-center justify-between">
//         <span className="text-sm text-gray-700">Auto Save</span>
//         <div className="w-10 h-6 bg-blue-500 rounded-full relative">
//           <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Sample data
// const chartData = [
//   { label: 'Sales', value: 75 },
//   { label: 'Marketing', value: 45 },
//   { label: 'Development', value: 90 },
//   { label: 'Support', value: 60 },
// ];

// const activities = [
//   { user: 'Alice', action: 'Completed task "Design UI"', time: '2h ago', avatar: 'A' },
//   { user: 'Bob', action: 'Created project "Client Portal"', time: '4h ago', avatar: 'B' },
//   { user: 'Charlie', action: 'Added member to team', time: '1d ago', avatar: 'C' },
// ];

// const events = [
//   { title: 'Team Meeting', date: 'Today, 2:00 PM' },
//   { title: 'Project Review', date: 'Tomorrow, 10:00 AM' },
//   { title: 'Sprint Planning', date: 'Friday, 9:00 AM' },
// ];

// const notifications = [
//   { type: 'success', message: 'Project completed successfully', time: '5m ago' },
//   { type: 'warning', message: 'Sprint ending in 2 days', time: '15m ago' },
//   { type: 'info', message: 'New team member joined', time: '1h ago' },
// ];

// // Default layout for demo widgets
// const defaultDemoLayout = [
//   { i: 'stats-1', x: 0, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
//   { i: 'stats-2', x: 3, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
//   { i: 'stats-3', x: 6, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
//   { i: 'stats-4', x: 9, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
//   { i: 'chart', x: 0, y: 2, w: 6, h: 4, minW: 4, maxW: 8 },
//   { i: 'activity', x: 6, y: 2, w: 6, h: 4, minW: 4, maxW: 8 },
//   { i: 'calendar', x: 0, y: 6, w: 4, h: 3, minW: 3, maxW: 6 },
//   { i: 'notifications', x: 4, y: 6, w: 4, h: 3, minW: 3, maxW: 6 },
//   { i: 'settings', x: 8, y: 6, w: 4, h: 3, minW: 3, maxW: 6 },
// ];

// export default function GridLayoutDemo() {
//   const [isGridMode, setIsGridMode] = useState(false);

//   const handleLayoutChange = (layout: any, layouts: any) => {
//     console.log('Demo layout changed:', layout, layouts);
//   };

//   const handleSaveLayout = (layouts: any) => {
//     console.log('Demo layout saved:', layouts);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 p-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Grid Layout Demo</h1>
//             <p className="text-gray-600">Experience the power of customizable grid layouts</p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setIsGridMode(!isGridMode)}
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                 isGridMode 
//                   ? 'bg-blue-600 text-white' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               {isGridMode ? 'Exit Grid Mode' : 'Grid Mode'}
//             </button>
//             {!isGridMode && (
//               <button
//                 onClick={() => setIsGridMode(true)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//               >
//                 Start Customizing
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Demo Content */}
//       {isGridMode ? (
//         <GridLayoutWrapper
//           title="Demo Layout"
//           defaultLayout={defaultDemoLayout}
//           onLayoutChange={handleLayoutChange}
//           onSaveLayout={handleSaveLayout}
//           className="p-4"
//         >
//           <div key="stats-1">
//             <StatsWidget
//               title="Total Revenue"
//               value="$124,500"
//               change={12}
//               icon={TrendingUp}
//               color="bg-green-500"
//             />
//           </div>
//           <div key="stats-2">
//             <StatsWidget
//               title="Active Users"
//               value="2,847"
//               change={8}
//               icon={Users}
//               color="bg-blue-500"
//             />
//           </div>
//           <div key="stats-3">
//             <StatsWidget
//               title="Projects"
//               value="24"
//               change={-3}
//               icon={FileText}
//               color="bg-purple-500"
//             />
//           </div>
//           <div key="stats-4">
//             <StatsWidget
//               title="Tasks Completed"
//               value="156"
//               change={15}
//               icon={Calendar}
//               color="bg-orange-500"
//             />
//           </div>
//           <div key="chart">
//             <ChartWidget
//               title="Performance Metrics"
//               data={chartData}
//               color="bg-blue-500"
//             />
//           </div>
//           <div key="activity">
//             <ActivityWidget activities={activities} />
//           </div>
//           <div key="calendar">
//             <CalendarWidget events={events} />
//           </div>
//           <div key="notifications">
//             <NotificationsWidget notifications={notifications} />
//           </div>
//           <div key="settings">
//             <SettingsWidget />
//           </div>
//         </GridLayoutWrapper>
//       ) : (
//         <div className="p-4">
//           <div className="max-w-4xl mx-auto">
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Grid3X3 size={32} className="text-blue-600" />
//               </div>
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">Grid Layout Demo</h2>
//               <p className="text-gray-600 max-w-2xl mx-auto">
//                 Experience the power of customizable grid layouts. Drag, resize, and organize widgets 
//                 to create your perfect dashboard. Click &quot;Start Customizing&quot; to begin.
//               </p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <Plus size={24} className="text-blue-600" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Drag & Drop</h3>
//                 <p className="text-sm text-gray-600">Move widgets around to organize your layout</p>
//               </div>
              
//               <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <Download size={24} className="text-green-600" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Resize</h3>
//                 <p className="text-sm text-gray-600">Resize widgets to fit your content needs</p>
//               </div>
              
//               <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <Upload size={24} className="text-purple-600" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Save & Load</h3>
//                 <p className="text-sm text-gray-600">Save your layouts and load them later</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 