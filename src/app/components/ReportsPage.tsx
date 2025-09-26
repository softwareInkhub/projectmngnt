// 'use client';

// import React, { useState, useEffect } from 'react';
// import { 
//   FileText, 
//   Download, 
//   Filter, 
//   Calendar,
//   TrendingUp,
//   TrendingDown,
//   BarChart2,
//   PieChart,
//   LineChart,
//   Activity,
//   Target,
//   Users,
//   DollarSign,
//   Search,
//   MoreHorizontal,
//   Edit,
//   Copy,
//   Trash2,
//   Grid3X3,
//   List
// } from 'lucide-react';

// interface Report {
//   id: string;
//   title: string;
//   type: 'analytics' | 'performance' | 'financial' | 'team';
//   status: 'completed' | 'in-progress' | 'scheduled';
//   lastUpdated: string;
//   size: string;
//   format: 'pdf' | 'excel' | 'csv';
// }

// const mockReports: Report[] = [
//   {
//     id: '1',
//     title: 'Q4 Project Performance Report',
//     type: 'performance',
//     status: 'completed',
//     lastUpdated: '2024-01-15',
//     size: '2.4 MB',
//     format: 'pdf'
//   },
//   {
//     id: '2',
//     title: 'Team Productivity Analytics',
//     type: 'analytics',
//     status: 'completed',
//     lastUpdated: '2024-01-14',
//     size: '1.8 MB',
//     format: 'excel'
//   },
//   {
//     id: '3',
//     title: 'Financial Summary Q4',
//     type: 'financial',
//     status: 'in-progress',
//     lastUpdated: '2024-01-13',
//     size: '3.2 MB',
//     format: 'pdf'
//   },
//   {
//     id: '4',
//     title: 'Team Capacity Report',
//     type: 'team',
//     status: 'scheduled',
//     lastUpdated: '2024-01-12',
//     size: '1.5 MB',
//     format: 'csv'
//   }
// ];

// const reportTypes = {
//   analytics: { icon: BarChart2, color: 'bg-blue-100 text-blue-700' },
//   performance: { icon: TrendingUp, color: 'bg-green-100 text-green-700' },
//   financial: { icon: DollarSign, color: 'bg-purple-100 text-purple-700' },
//   team: { icon: Users, color: 'bg-orange-100 text-orange-700' }
// };

// const statusColors = {
//   completed: 'bg-green-100 text-green-700',
//   'in-progress': 'bg-yellow-100 text-yellow-700',
//   scheduled: 'bg-slate-100 text-slate-700'
// };

// export default function ReportsPage({ onOpenTab }: { onOpenTab?: (tabType: string, context?: any) => void }) {
//   const [reports, setReports] = useState<Report[]>(mockReports);
//   const [selectedType, setSelectedType] = useState<string>('all');
//   const [selectedStatus, setSelectedStatus] = useState<string>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [openMenuId, setOpenMenuId] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

//   const analytics = {
//     totalReports: reports.length,
//     completedReports: reports.filter(r => r.status === 'completed').length,
//     inProgressReports: reports.filter(r => r.status === 'in-progress').length,
//     scheduledReports: reports.filter(r => r.status === 'scheduled').length
//   };

//   const filteredReports = reports.filter(report => {
//     const matchesType = selectedType === 'all' || report.type === selectedType;
//     const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
//     const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesType && matchesStatus && matchesSearch;
//   });

//   const handleDownload = (report: Report) => {
//     console.log(`Downloading ${report.title}`);
//     // In a real app, this would trigger a download
//   };

//   const handleDelete = (reportId: string) => {
//     setReports(reports.filter(r => r.id !== reportId));
//   };

//   const toggleMenu = (reportId: string) => {
//     setOpenMenuId(openMenuId === reportId ? null : reportId);
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Element;
//       if (!target.closest('.menu-container') && !target.closest('button[aria-label="Open menu"]')) {
//         setOpenMenuId(null);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-100">
//       {/* Header */}
//       <div className="bg-blue-100 border-b border-slate-200 shadow-sm">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 px-3 md:px-8 py-1 md:py-2">
//           <div className="flex items-center gap-3">
//             <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
//               <FileText className="w-6 h-6" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900 leading-tight">Reports Analytics</h1>
//               <p className="text-slate-600 mt-1 text-xl">Generate and manage project reports</p>
//             </div>
//           </div>
          
//           {/* Actions (responsive) */}
//           <div className="hidden md:flex items-center gap-3">
//             {/* Desktop search/filters */}
//             <div className="relative hidden md:block">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
//               <input type="text" placeholder="Search reports..." value={searchTerm ?? ""} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 text-xl" />
//             </div>
//             <select value={selectedType ?? ""} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
//               <option value="all">All Types</option>
//               <option value="analytics">Analytics</option>
//               <option value="performance">Performance</option>
//               <option value="financial">Financial</option>
//               <option value="team">Team</option>
//             </select>
//             <select value={selectedStatus ?? ""} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
//               <option value="all">All Status</option>
//               <option value="completed">Completed</option>
//               <option value="in-progress">In Progress</option>
//               <option value="scheduled">Scheduled</option>
//             </select>
//             <button className="hidden md:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-xl">
//               <FileText size={18} className="group-hover:rotate-90 transition-transform duration-200" />
//               New Report
//             </button>
//           </div>

//           {/* Mobile compact actions - optimized for better fit */}
//           <div className="flex md:hidden items-center gap-1.5 w-full justify-end">
//             {/* Mobile search - moved to header area */}
//             <div className="relative flex-1 max-w-32">
//               <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
//               <input 
//                 type="text" 
//                 placeholder="Search..." 
//                 value={searchTerm} 
//                 onChange={(e) => setSearchTerm(e.target.value)} 
//                 className="pl-7 pr-2 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full" 
//               />
//             </div>
//             <button className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md text-xs font-medium">Create</button>
//           </div>
//         </div>
//       </div>

//       <div className="px-1 md:px-8 py-2 md:py-8 space-y-2 md:space-y-6">
//         {/* Analytics Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 max-w-[95%] md:max-w-none mx-auto md:mx-0">
//           <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[8px] md:text-xs text-slate-500 font-semibold md:font-normal">Total Reports</p>
//                 <p className="text-xs md:text-lg font-semibold text-slate-900">{analytics.totalReports}</p>
//               </div>
//               <div className="p-1.5 md:p-3 bg-blue-100 rounded-lg">
//                 <FileText className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[8px] md:text-xs text-slate-500 font-semibold md:font-normal">Completed</p>
//                 <p className="text-xs md:text-lg font-semibold text-slate-900">{analytics.completedReports}</p>
//               </div>
//               <div className="p-1.5 md:p-3 bg-green-100 rounded-lg">
//                 <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[8px] md:text-xs text-slate-500 font-semibold md:font-normal">In Progress</p>
//                 <p className="text-xs md:text-lg font-semibold text-slate-900">{analytics.inProgressReports}</p>
//               </div>
//               <div className="p-1.5 md:p-3 bg-yellow-100 rounded-lg">
//                 <Activity className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[8px] md:text-xs text-slate-500 font-semibold md:font-normal">Scheduled</p>
//                 <p className="text-xs md:text-lg font-semibold text-slate-900">{analytics.scheduledReports}</p>
//               </div>
//               <div className="p-1.5 md:p-3 bg-slate-100 rounded-lg">
//                 <Calendar className="w-4 h-4 md:w-6 md:h-6 text-slate-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* View Mode Toggle */}
//         <div className="flex items-center justify-between mb-4 md:mb-6 mx-2 md:mx-0">
//           {/* Left side - Grid/List toggle and report count */}
//           <div className="flex items-center gap-3 md:gap-4">
//             <div className="flex items-center bg-slate-100 rounded-lg p-1">
//               <button
//                 onClick={() => setViewMode("grid")}
//                 className={`p-1.5 md:p-2 rounded-md transition-colors ${
//                   viewMode === "grid" 
//                     ? "bg-white text-blue-600 shadow-sm" 
//                     : "text-slate-600 hover:text-slate-900"
//                 }`}
//               >
//                 <Grid3X3 size={14} className="md:w-4 md:h-4" />
//               </button>
//               <button
//                 onClick={() => setViewMode("list")}
//                 className={`p-1.5 md:p-2 rounded-md transition-colors ${
//                   viewMode === "list" 
//                     ? "bg-white text-blue-600 shadow-sm" 
//                     : "text-slate-600 hover:text-slate-900"
//                 }`}
//               >
//                 <List size={14} className="md:w-4 md:h-4" />
//               </button>
//             </div>
//             <span className="text-sm md:text-base text-slate-600">
//               {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
//             </span>
//           </div>
//         </div>

//         {/* Reports Display */}
//         {viewMode === 'grid' ? (
//           <div className={`grid gap-2 md:gap-3 mx-2 md:mx-0 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7`}>
//           {filteredReports.map((report) => {
//             const TypeIcon = reportTypes[report.type as keyof typeof reportTypes]?.icon || FileText;
//             const typeColor = reportTypes[report.type as keyof typeof reportTypes]?.color || 'bg-slate-100 text-slate-700';
            
//             return (
//               <div
//                 key={report.id}
//                 className="relative bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 hover:from-blue-100 hover:to-blue-200 flex flex-col h-full cursor-pointer p-2"
//               >
//                 {/* Header - Icon and Menu */}
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className={`p-1.5 rounded-lg flex-shrink-0 ${typeColor}`}>
//                     <TypeIcon className="w-4 h-4" />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <h3 className="text-sm font-semibold text-slate-900 truncate">{report.title}</h3>
//                     <p className="text-xs text-slate-600">Report</p>
//                   </div>
//                   <div className="relative flex-shrink-0 menu-container">
//                     <button 
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setOpenMenuId(openMenuId === report.id ? null : report.id);
//                       }}
//                       className="p-1 rounded-lg hover:bg-slate-100 transition-colors text-gray-400"
//                       aria-label="Open menu"
//                     >
//                       <MoreHorizontal className="w-4 h-4" />
//                     </button>
//                     {openMenuId === report.id && (
//                       <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl z-[99999] min-w-[160px]">
//                         <div className="py-1">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDownload(report);
//                               setOpenMenuId(null);
//                             }}
//                             className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-3"
//                           >
//                             <Download className="w-4 h-4" />
//                             Download
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setOpenMenuId(null);
//                             }}
//                             className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-3"
//                           >
//                             <Edit className="w-4 h-4" />
//                             Edit Report
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setOpenMenuId(null);
//                             }}
//                             className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-3"
//                           >
//                             <Copy className="w-4 h-4" />
//                             Duplicate
//                           </button>
//                           <div className="border-t border-gray-100 my-1"></div>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDelete(report.id);
//                               setOpenMenuId(null);
//                             }}
//                             className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Status and Type Tags */}
//                 <div className="flex items-center gap-1 mb-2">
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[report.status as keyof typeof statusColors]}`}>
//                     {report.status}
//                   </span>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeColor}`}>
//                     {report.type}
//                   </span>
//                 </div>

//                 {/* File Info */}
//                 <div className="text-xs text-slate-600 space-y-1">
//                   <div className="flex items-center justify-between">
//                     <span>Size:</span>
//                     <span className="font-medium">{report.size}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span>Format:</span>
//                     <span className="font-medium">{report.format.toUpperCase()}</span>
//                   </div>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
//                   <div 
//                     className={`h-1.5 rounded-full transition-all duration-300 ${
//                       report.status === 'completed' ? 'bg-green-500' :
//                       report.status === 'in-progress' ? 'bg-yellow-500' :
//                       'bg-slate-400'
//                     }`}
//                     style={{ width: report.status === 'completed' ? '100%' : report.status === 'in-progress' ? '60%' : '20%' }}
//                   ></div>
//                 </div>
//               </div>
//             );
//           })}
//           </div>
//         ) : (
//           /* List View */
//           <div className="bg-white rounded-lg shadow-sm border border-slate-200 mx-2 md:mx-0">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50 border-b border-slate-200">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Report</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Size</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Format</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Updated</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-slate-200">
//                   {filteredReports.map((report) => {
//                     const TypeIcon = reportTypes[report.type as keyof typeof reportTypes]?.icon || FileText;
//                     const typeColor = reportTypes[report.type as keyof typeof reportTypes]?.color || 'bg-slate-100 text-slate-700';
                    
//                     return (
//                       <tr key={report.id} className="hover:bg-slate-50 transition-colors">
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className={`p-2 rounded-lg flex-shrink-0 ${typeColor}`}>
//                               <TypeIcon className="w-4 h-4" />
//                             </div>
//                             <div className="ml-3">
//                               <div className="text-sm font-medium text-slate-900">{report.title}</div>
//                               <div className="text-sm text-slate-500">Report</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeColor}`}>
//                             {report.type}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[report.status as keyof typeof statusColors]}`}>
//                             {report.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">{report.size}</td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">{report.format.toUpperCase()}</td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">{report.lastUpdated}</td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="relative">
//                             <button 
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 setOpenMenuId(openMenuId === report.id ? null : report.id);
//                               }}
//                               className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-gray-400"
//                               aria-label="Open menu"
//                             >
//                               <MoreHorizontal className="w-5 h-5" />
//                             </button>
//                             {openMenuId === report.id && (
//                               <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl z-[99999] min-w-[160px]">
//                                 <div className="py-1">
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleDownload(report);
//                                       setOpenMenuId(null);
//                                     }}
//                                     className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-3"
//                                   >
//                                     <Download className="w-4 h-4" />
//                                     Download
//                                   </button>
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setOpenMenuId(null);
//                                     }}
//                                     className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-3"
//                                   >
//                                     <Edit className="w-4 h-4" />
//                                     Edit Report
//                                   </button>
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setOpenMenuId(null);
//                                     }}
//                                     className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-3"
//                                   >
//                                     <Copy className="w-4 h-4" />
//                                     Duplicate
//                                   </button>
//                                   <div className="border-t border-gray-100 my-1"></div>
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleDelete(report.id);
//                                       setOpenMenuId(null);
//                                     }}
//                                     className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
//                                   >
//                                     <Trash2 className="w-4 h-4" />
//                                     Delete
//                                   </button>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Empty State */}
//         {filteredReports.length === 0 && (
//           <div className="text-center py-12">
//             <FileText size={48} className="mx-auto mb-4 text-slate-300" />
//             <h3 className="text-lg font-semibold text-slate-900 mb-2">No reports found</h3>
//             <p className="text-slate-500">Try adjusting your filters or create a new report</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// } 