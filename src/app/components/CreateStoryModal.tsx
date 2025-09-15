import React, { useState } from "react";
import { X, ChevronDown, Plus, BookOpen, Target, Calendar, Users, FileText, CheckSquare } from "lucide-react";

interface CreateStoryModalProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (story: {
    title: string;
    description: string;
    project: string;
    sprint: string;
    status: string;
    priority: string;
    storyPoints: string;
    assignee: string;
    startDate: string;
    dueDate: string;
    acceptanceCriteria: string[];
    teamMembers: string[];
  }) => void;
}

const projects = ["Whapi Project Management", "E-commerce Platform", "Client Portal", "Mobile App Development", "API Integration"];
const sprints = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"];
const statuses = ["To Do", "In Progress", "Review", "Done", "Blocked"];
const priorities = ["Low", "Medium", "High", "Critical"];
const assignees = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen", "Frank Miller"];
const availableMembers = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen", "Frank Miller", "Grace Lee", "Henry Brown"];

export default function CreateStoryModal({ open, onClose, onCreate }: CreateStoryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [sprint, setSprint] = useState("");
  const [status, setStatus] = useState(statuses[0]);
  const [priority, setPriority] = useState(priorities[1]);
  const [storyPoints, setStoryPoints] = useState("");
  const [assignee, setAssignee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>([""]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showSprintDropdown, setShowSprintDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  
  // New project modal states
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const toggleMember = (member: string) => {
    setSelectedMembers(prev => 
      prev.includes(member) 
        ? prev.filter(m => m !== member) 
        : [...prev, member]
    );
  };

  const addAcceptanceCriteria = () => {
    setAcceptanceCriteria(prev => [...prev, ""]);
  };

  const updateAcceptanceCriteria = (index: number, value: string) => {
    setAcceptanceCriteria(prev => 
      prev.map((criteria, i) => i === index ? value : criteria)
    );
  };

  const removeAcceptanceCriteria = (index: number) => {
    setAcceptanceCriteria(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && project && onCreate) {
      onCreate({
        title,
        description,
        project,
        sprint,
        status,
        priority,
        storyPoints,
        assignee,
        startDate,
        dueDate,
        acceptanceCriteria: acceptanceCriteria.filter(criteria => criteria.trim() !== ""),
        teamMembers: selectedMembers
      });
    }
  };

  const handleCreateNewProject = () => {
    if (newProjectName.trim()) {
      const newProject = newProjectName.trim();
      setProject(newProject);
      if (!projects.includes(newProject)) {
        projects.push(newProject);
      }
      setNewProjectName("");
      setNewProjectDescription("");
      setShowNewProjectModal(false);
      setShowProjectDropdown(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs mx-4 relative max-h-[80vh] overflow-y-auto border border-gray-200/50">
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-3 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Create New Story</h2>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        
          <form className="p-5 space-y-3" onSubmit={handleSubmit}>
            {/* Story Information */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-3 h-3 text-orange-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Story Information</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Story Title *</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-all"
                placeholder="Enter story title"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-all resize-none"
                rows={2}
                placeholder="Describe the user story and requirements..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-700">Project *</label>
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(true)}
                  className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  <Plus size={12} />
                  Add New
                </button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <span className={project ? "text-gray-900 text-xs" : "text-gray-400 text-xs"}>
                    {project || "Select a project"}
                  </span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>
                {showProjectDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-28 overflow-y-auto">
                    {projects.map((projectOption) => (
                      <button
                        key={projectOption}
                        type="button"
                        onClick={() => {
                          setProject(projectOption);
                          setShowProjectDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors"
                      >
                        {projectOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sprint</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSprintDropdown(!showSprintDropdown)}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <span className={sprint ? "text-gray-900 text-xs" : "text-gray-400 text-xs"}>
                    {sprint || "Select a sprint"}
                  </span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>
                {showSprintDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-28 overflow-y-auto">
                    {sprints.map((sprintOption) => (
                      <button
                        key={sprintOption}
                        type="button"
                        onClick={() => {
                          setSprint(sprintOption);
                          setShowSprintDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors"
                      >
                        {sprintOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Story Details */}
            <div className="flex items-center space-x-2 mb-4 mt-6">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-3 h-3 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Story Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <span className="text-gray-900 text-xs">{status}</span>
                    <ChevronDown size={12} className="text-gray-400" />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-28 overflow-y-auto">
                      {statuses.map((statusOption) => (
                        <button
                          key={statusOption}
                          type="button"
                          onClick={() => {
                            setStatus(statusOption);
                            setShowStatusDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors"
                        >
                          {statusOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <span className="text-gray-900 text-xs">{priority}</span>
                    <ChevronDown size={12} className="text-gray-400" />
                  </button>
                  {showPriorityDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-28 overflow-y-auto">
                      {priorities.map((priorityOption) => (
                        <button
                          key={priorityOption}
                          type="button"
                          onClick={() => {
                            setPriority(priorityOption);
                            setShowPriorityDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors"
                        >
                          {priorityOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Story Points</label>
                <input
                  value={storyPoints}
                  onChange={e => setStoryPoints(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-all"
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Assignee</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                    className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <span className={assignee ? "text-gray-900 text-xs" : "text-gray-400 text-xs"}>
                      {assignee || "Select assignee"}
                    </span>
                    <ChevronDown size={12} className="text-gray-400" />
                  </button>
                  {showAssigneeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-28 overflow-y-auto">
                      {assignees.map((assigneeOption) => (
                        <button
                          key={assigneeOption}
                          type="button"
                          onClick={() => {
                            setAssignee(assigneeOption);
                            setShowAssigneeDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors"
                        >
                          {assigneeOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center space-x-2 mb-4 mt-6">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-3 h-3 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Timeline</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="date"
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                <input 
                  type="date"
                  value={dueDate} 
                  onChange={e => setDueDate(e.target.value)} 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all"
                />
              </div>
            </div>

            {/* Acceptance Criteria */}
            <div className="flex items-center space-x-2 mb-4 mt-6">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-3 h-3 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Acceptance Criteria</h3>
            </div>

            <div className="space-y-2">
              {acceptanceCriteria.map((criteria, index) => (
                <div key={`modal-criteria-${index}`} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={criteria}
                    onChange={(e) => updateAcceptanceCriteria(index, e.target.value)}
                    placeholder={`Acceptance criteria ${index + 1}`}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-all"
                  />
                  {acceptanceCriteria.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAcceptanceCriteria(index)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAcceptanceCriteria}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                <Plus size={12} />
                Add Criteria
              </button>
            </div>

            {/* Team Members */}
            <div className="flex items-center space-x-2 mb-4 mt-6">
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-3 h-3 text-indigo-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Team Members</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Story Team</label>
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
                disabled={!title || !project}
                className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-xs font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 relative border border-gray-200/50">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Add New Project</h3>
                <button 
                  onClick={() => setShowNewProjectModal(false)} 
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Project Name *</label>
                <input
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-all"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProjectDescription}
                  onChange={e => setNewProjectDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-all resize-none"
                  rows={2}
                  placeholder="Brief project description..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewProject}
                  disabled={!newProjectName.trim()}
                  className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-xs font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Add Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 