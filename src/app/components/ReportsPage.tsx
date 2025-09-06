'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart2,
  PieChart,
  LineChart,
  Activity,
  Target,
  Users,
  DollarSign,
  Search,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'analytics' | 'performance' | 'financial' | 'team';
  status: 'completed' | 'in-progress' | 'scheduled';
  lastUpdated: string;
  size: string;
  format: 'pdf' | 'excel' | 'csv';
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Q4 Project Performance Report',
    type: 'performance',
    status: 'completed',
    lastUpdated: '2024-01-15',
    size: '2.4 MB',
    format: 'pdf'
  },
  {
    id: '2',
    title: 'Team Productivity Analytics',
    type: 'analytics',
    status: 'completed',
    lastUpdated: '2024-01-14',
    size: '1.8 MB',
    format: 'excel'
  },
  {
    id: '3',
    title: 'Financial Summary Q4',
    type: 'financial',
    status: 'in-progress',
    lastUpdated: '2024-01-13',
    size: '3.2 MB',
    format: 'pdf'
  },
  {
    id: '4',
    title: 'Team Capacity Report',
    type: 'team',
    status: 'scheduled',
    lastUpdated: '2024-01-12',
    size: '1.5 MB',
    format: 'csv'
  }
];

const reportTypes = {
  analytics: { icon: BarChart2, color: 'bg-blue-100 text-blue-700' },
  performance: { icon: TrendingUp, color: 'bg-green-100 text-green-700' },
  financial: { icon: DollarSign, color: 'bg-purple-100 text-purple-700' },
  team: { icon: Users, color: 'bg-orange-100 text-orange-700' }
};

const statusColors = {
  completed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-slate-100 text-slate-700'
};

export default function ReportsPage({ onOpenTab }: { onOpenTab?: (tabType: string, context?: any) => void }) {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const analytics = {
    totalReports: reports.length,
    completedReports: reports.filter(r => r.status === 'completed').length,
    inProgressReports: reports.filter(r => r.status === 'in-progress').length,
    scheduledReports: reports.filter(r => r.status === 'scheduled').length
  };

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleDownload = (report: Report) => {
    console.log(`Downloading ${report.title}`);
    // In a real app, this would trigger a download
  };

  const handleDelete = (reportId: string) => {
    setReports(reports.filter(r => r.id !== reportId));
  };

  const toggleMenu = (reportId: string) => {
    setOpenMenuId(openMenuId === reportId ? null : reportId);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-blue-100 border-b border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 px-3 md:px-8 py-1 md:py-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">Reports Analytics</h1>
              <p className="text-slate-600 mt-1 text-xl">Generate and manage project reports</p>
            </div>
          </div>
          
          {/* Actions (responsive) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Desktop search/filters */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 text-xl" />
            </div>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
              <option value="all">All Types</option>
              <option value="analytics">Analytics</option>
              <option value="performance">Performance</option>
              <option value="financial">Financial</option>
              <option value="team">Team</option>
            </select>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
            </select>
            <button className="hidden md:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-xl">
              <FileText size={18} className="group-hover:rotate-90 transition-transform duration-200" />
              New Report
            </button>
          </div>

          {/* Mobile compact actions - optimized for better fit */}
          <div className="flex md:hidden items-center gap-1.5 w-full justify-end">
            {/* Mobile search - moved to header area */}
            <div className="relative flex-1 max-w-32">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-7 pr-2 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full" 
              />
            </div>
            <button className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md text-xs font-medium">Create</button>
          </div>
        </div>
      </div>

      <div className="px-1 md:px-8 py-2 md:py-8 space-y-2 md:space-y-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 max-w-[95%] md:max-w-none mx-auto md:mx-0">
          <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] md:text-xs text-slate-500 font-semibold md:font-normal">Total Reports</p>
                <p className="text-xs md:text-lg font-semibold text-slate-900">{analytics.totalReports}</p>
              </div>
              <div className="p-1.5 md:p-3 bg-blue-100 rounded-lg">
                <FileText className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] md:text-xs text-slate-500 font-semibold md:font-normal">Completed</p>
                <p className="text-xs md:text-lg font-semibold text-slate-900">{analytics.completedReports}</p>
              </div>
              <div className="p-1.5 md:p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] md:text-xs text-slate-500 font-semibold md:font-normal">In Progress</p>
                <p className="text-xs md:text-lg font-semibold text-slate-900">{analytics.inProgressReports}</p>
              </div>
              <div className="p-1.5 md:p-3 bg-yellow-100 rounded-lg">
                <Activity className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] md:text-xs text-slate-500 font-semibold md:font-normal">Scheduled</p>
                <p className="text-xs md:text-lg font-semibold text-slate-900">{analytics.scheduledReports}</p>
              </div>
              <div className="p-1.5 md:p-3 bg-slate-100 rounded-lg">
                <Calendar className="w-4 h-4 md:w-6 md:h-6 text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className={`grid gap-3 md:gap-6 mx-2 md:mx-0 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3`}>
          {filteredReports.map((report) => {
            const TypeIcon = reportTypes[report.type as keyof typeof reportTypes]?.icon || FileText;
            const typeColor = reportTypes[report.type as keyof typeof reportTypes]?.color || 'bg-slate-100 text-slate-700';
            
            return (
              <div
                key={report.id}
                className="relative bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300 flex flex-col h-full cursor-pointer p-2 md:p-3"
              >
                {/* Header - Title and Menu */}
                <div className="mb-1 md:mb-4">
                  <div className="flex items-start justify-between mb-0.5 md:mb-2">
                    <div className="flex items-start gap-1.5 md:gap-3 flex-1 min-w-0">
                      <div className={`p-1 md:p-2 rounded-lg flex-shrink-0 ${typeColor}`}>
                        <TypeIcon className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-[10px] md:text-lg mb-0.5 md:mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{report.title}</h3>
                        <p className="text-[8px] md:text-sm text-slate-500 break-words">Report</p>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0 ml-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(report.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Open menu"
                      >
                        <MoreHorizontal size={14} className="text-slate-400" />
                      </button>
                      <div className={`absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[160px] menu-container ${openMenuId === report.id ? '' : 'hidden'}`}>
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(report);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add edit functionality here if needed
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Report
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add duplicate functionality here if needed
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <div className="border-t border-slate-200 my-1"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(report.id);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Stats */}
                <div className="grid grid-cols-2 gap-1.5 md:gap-3 mb-1 md:mb-3">
                  <div className="text-center">
                    <div className="text-sm md:text-2xl font-bold text-slate-900">{report.size}</div>
                    <div className="text-[8px] md:text-[10px] text-slate-500 font-medium">Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm md:text-2xl font-bold text-slate-900">{report.format.toUpperCase()}</div>
                    <div className="text-[8px] md:text-[10px] text-slate-500 font-medium">Format</div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="w-full bg-slate-200 rounded-full h-1 md:h-2 mb-0.5 md:mb-3">
                  <div 
                    className={`h-1 md:h-2 rounded-full transition-all duration-300 ${
                      report.status === 'completed' ? 'bg-green-500' :
                      report.status === 'in-progress' ? 'bg-yellow-500' :
                      'bg-slate-400'
                    }`}
                    style={{ width: report.status === 'completed' ? '100%' : report.status === 'in-progress' ? '60%' : '20%' }}
                  ></div>
                </div>

                {/* Status and Type Tags */}
                <div className="flex items-center justify-center gap-1.5 md:gap-3 mb-0.5 md:mb-3">
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-semibold ${statusColors[report.status as keyof typeof statusColors]}`}>
                    {report.status}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-semibold ${typeColor}`}>
                    {report.type}
                  </span>
                </div>

                {/* Details grid: desktop 2x2 (Last Updated, Type | Size, Format), mobile hidden */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-1.5 md:mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="text-[10px] text-slate-700 font-medium break-words">{report.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="text-[10px] text-slate-700 font-medium">{report.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="text-[10px] text-slate-700 font-medium">{report.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="text-[10px] text-slate-700 font-medium">{report.format.toUpperCase()}</span>
                  </div>
                </div>


              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No reports found</h3>
            <p className="text-slate-500">Try adjusting your filters or create a new report</p>
          </div>
        )}
      </div>
    </div>
  );
} 