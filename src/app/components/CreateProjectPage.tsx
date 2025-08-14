"use client";
import { useState, useEffect } from "react";
import { CompanyApiService, CompanyData } from "../utils/companyApi";

export default function CreateProjectPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Planning");
  const [priority, setPriority] = useState("Medium");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [team, setTeam] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  
  // State for companies from API
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setIsLoadingCompanies(true);
      setCompaniesError(null);
      
      const response = await CompanyApiService.getCompanies();
      
      if (response.success && response.data && response.data.items) {
        const realCompanies = response.data.items
          .filter((item: any) => item.name && item.id) // Filter out invalid items
          .map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            type: item.type || '',
            industry: item.industry || '',
            status: item.status || 'Active',
            founded: item.founded || '',
            employees: item.employees || 0,
            location: item.location || '',
            website: item.website || '',
            email: item.email || '',
            phone: item.phone || '',
            revenue: item.revenue || '',
            tags: item.tags || '',
            notes: item.notes || '',
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString()
          }));
        
        setCompanies(realCompanies);
        
        // Set the first company as default if available
        if (realCompanies.length > 0) {
          setCompany(realCompanies[0].name);
        }
        
        console.log('Fetched companies from API:', realCompanies);
      } else {
        console.log('No companies found or API error:', response);
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompaniesError('Failed to load companies');
      setCompanies([]);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  // Load companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const availableTags = [
    "Frontend", "Backend", "Mobile", "Web", "API", 
    "Database", "UI/UX", "Testing", "DevOps", "Security"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating project:", {
      name,
      description,
      company,
      status,
      priority,
      startDate,
      endDate,
      budget,
      team,
      tags,
      notes
    });
    
    // Here you would typically send the data to your API
    // For now, we'll just log it
    alert("Project creation functionality will be implemented with API integration");
  };

  const toggleTag = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Create New Project</h1>
            <p className="text-slate-600">Set up a new project with all the essential details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                {isLoadingCompanies ? (
                  <div className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-neutral-50">
                    Loading companies...
                  </div>
                ) : companiesError ? (
                  <div className="w-full border border-red-200 rounded-lg px-3 py-2 bg-red-50 text-red-600">
                    {companiesError}
                  </div>
                ) : (
                  <select 
                    value={company} 
                    onChange={e => setCompany(e.target.value)} 
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a company</option>
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.name}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value)} 
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select 
                  value={priority} 
                  onChange={e => setPriority(e.target.value)} 
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Budget</label>
                <input
                  type="text"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $50,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Team</label>
                <input
                  type="text"
                  value={team}
                  onChange={e => setTeam(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team name"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the project goals, scope, and key deliverables..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      tags.includes(tag)
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes or comments..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 