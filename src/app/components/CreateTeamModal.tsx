import React, { useState } from "react";
import { X, ChevronDown, Plus, Users, Target, Calendar, MessageSquare, Building, FolderOpen, CheckSquare, BarChart3 } from "lucide-react";

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (team: {
    name: string;
    description: string;
    department: string;
    company: string;
    manager: string;
    whatsappGroupId?: string;
    whatsappGroupName?: string;
    startDate: string;
    teamMembers: string[];
  }) => void;
}

const departments = ["Engineering", "Design", "Marketing", "Sales", "Product", "Operations"];
// Companies will be fetched from API
const companies: string[] = [];
const managers = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen"];
const availableMembers = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen", "Frank Miller", "Grace Lee", "Henry Brown"];
const whatsappGroups = [
  { id: "1", name: "Development Team" },
  { id: "2", name: "Design Team" },
  { id: "3", name: "Marketing Team" },
  { id: "4", name: "Sales Team" },
  { id: "5", name: "Product Team" }
];

export default function CreateTeamModal({ open, onClose, onCreate }: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [company, setCompany] = useState("");
  const [manager, setManager] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null);
  const [startDate, setStartDate] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  
  // New company modal states
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyDescription, setNewCompanyDescription] = useState("");

  const toggleMember = (member: string) => {
    setSelectedMembers(prev => 
      prev.includes(member) 
        ? prev.filter(m => m !== member) 
        : [...prev, member]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && department && onCreate) {
      onCreate({
        name,
        description,
        department,
        company,
        manager,
        whatsappGroupId: selectedGroup?.id,
        whatsappGroupName: selectedGroup?.name,
        startDate,
        teamMembers: selectedMembers
      });
    }
  };

  const handleCreateNewCompany = () => {
    if (newCompanyName.trim()) {
      const newCompany = newCompanyName.trim();
      setCompany(newCompany);
      if (!companies.includes(newCompany)) {
        companies.push(newCompany);
      }
      setNewCompanyName("");
      setNewCompanyDescription("");
      setShowNewCompanyModal(false);
      setShowCompanyDropdown(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs mx-4 relative max-h-[80vh] overflow-y-auto border border-gray-200/50">
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-3 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Create New Team</h2>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        
          <form className="p-5 space-y-3" onSubmit={handleSubmit}>
            {/* Team Information */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-3 h-3 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Team Information</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Team Name *</label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-all"
                placeholder="Enter team name"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-all resize-none"
                rows={2}
                placeholder="Describe the team's role and responsibilities..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Department *</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <span className={department ? "text-gray-900 text-xs" : "text-gray-400 text-xs"}>
                    {department || "Select a department"}
                  </span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>
                {showDepartmentDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-28 overflow-y-auto">
                    {departments.map((departmentOption) => (
                      <button
                        key={departmentOption}
                        type="button"
                        onClick={() => {
                          setDepartment(departmentOption);
                          setShowDepartmentDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors"
                      >
                        {departmentOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-700">Company</label>
                <button
                  type="button"
                  onClick={() => setShowNewCompanyModal(true)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Plus size={12} />
                  Add New
                </button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <span className={company ? "text-gray-900 text-xs" : "text-gray-400 text-xs"}>
                    {company || "Select a company"}
                  </span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>
                {showCompanyDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {/* Company Options */}
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Companies</span>
                    </div>
                    {companies.map((companyOption) => (
                      <button
                        key={companyOption}
                        type="button"
                        onClick={() => {
                          setCompany(companyOption);
                          setShowCompanyDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors flex items-center gap-3"
                      >
                        <Building size={12} className="text-blue-500" />
                        {companyOption}
                      </button>
                    ))}
                    
                    {/* Company Management Options */}
                    <div className="border-t border-gray-200">
                      <div className="px-3 py-2 bg-gray-50">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Company Management</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          // TODO: Open Projects page for selected company
                          setShowCompanyDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors flex items-center gap-3"
                      >
                        <FolderOpen size={12} className="text-green-500" />
                        Projects
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // TODO: Open Sprints page for selected company
                          setShowCompanyDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors flex items-center gap-3"
                      >
                        <Calendar size={12} className="text-purple-500" />
                        Sprints
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // TODO: Open Tasks page for selected company
                          setShowCompanyDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors flex items-center gap-3"
                      >
                        <CheckSquare size={12} className="text-orange-500" />
                        Tasks
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // TODO: Open Teams page for selected company
                          setShowCompanyDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors flex items-center gap-3"
                      >
                        <Users size={12} className="text-indigo-500" />
                        Teams
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // TODO: Open Departments page for selected company
                          setShowCompanyDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors flex items-center gap-3"
                      >
                        <Building size={12} className="text-teal-500" />
                        Departments
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // TODO: Open Stories page for selected company
                          setShowCompanyDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors flex items-center gap-3"
                      >
                        <BarChart3 size={12} className="text-pink-500" />
                        Stories
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Team Details */}
            <div className="flex items-center space-x-2 mb-4 mt-6">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-3 h-3 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Team Details</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Manager</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowManagerDropdown(!showManagerDropdown)}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <span className={manager ? "text-gray-900 text-xs" : "text-gray-400 text-xs"}>
                    {manager || "Select manager"}
                  </span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>
                {showManagerDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-28 overflow-y-auto">
                    {managers.map((managerOption) => (
                      <button
                        key={managerOption}
                        type="button"
                        onClick={() => {
                          setManager(managerOption);
                          setShowManagerDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors"
                      >
                        {managerOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp Group</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <span className={selectedGroup ? "text-gray-900 text-xs" : "text-gray-400 text-xs"}>
                    {selectedGroup ? selectedGroup.name : "Select a WhatsApp group"}
                  </span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>
                {showGroupDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-28 overflow-y-auto">
                    {whatsappGroups.map((group) => (
                      <button
                        key={`whatsapp-modal-${group.id}`}
                        type="button"
                        onClick={() => {
                          setSelectedGroup(group);
                          setShowGroupDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors"
                      >
                        {group.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center space-x-2 mb-4 mt-6">
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-3 h-3 text-orange-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Timeline</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
              <input 
                type="date"
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50/50 transition-all"
              />
            </div>

            {/* Team Members */}
            <div className="flex items-center space-x-2 mb-4 mt-6">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-3 h-3 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Team Members</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Team Members</label>
              <div className="flex flex-wrap gap-1">
                {availableMembers.map(member => (
                  <button
                    key={member}
                    type="button"
                    onClick={() => toggleMember(member)}
                    className={`px-2 py-1 rounded-md border text-xs font-medium transition-all ${
                      selectedMembers.includes(member) 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {member}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!name || !department}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* New Company Modal */}
      {showNewCompanyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 relative border border-gray-200/50">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Add New Company</h3>
                <button 
                  onClick={() => setShowNewCompanyModal(false)} 
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-all"
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCompanyDescription}
                  onChange={e => setNewCompanyDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-all resize-none"
                  rows={2}
                  placeholder="Brief company description..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCompanyModal(false)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewCompany}
                  disabled={!newCompanyName.trim()}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Add Company
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 