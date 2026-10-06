import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Settings,
  Plus,
  CheckCircle2,
  ChevronDown,
  Info,
  SlidersHorizontal,
  Check,
  Search,
  X,
  Home,
  Building2,
  Briefcase,
  Loader2,
  RefreshCw,
  Filter,
  MapPin
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useAINinja } from '../contexts/AINinjaContext';
import { BRAND } from '../config/branding';
import { API_URL } from '../config/api';
import SideMenu from './SideMenu';
import DashboardLayout from './DashboardLayout';
import JobListingComponent, { Resend, Supabase, Turso } from './ui/JobListingComponent';
import './SideMenu.css';

const Jobs = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const { openChatWithJob } = useAINinja();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  // Jobs data state
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobStats, setJobStats] = useState({ totalJobs: 0, visaJobs: 0, remoteJobs: 0, highPayJobs: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState(() => localStorage.getItem('last_search_keyword') || '');
  const [locationFilter, setLocationFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('all'); // Changed from 'us' to 'all' to show 100k jobs
  const [sponsorshipFilter, setSponsorshipFilter] = useState('all');
  const [workTypeFilter, setWorkTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendedTags, setRecommendedTags] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');

  // Advanced Filter States
  const [selectedJobFunctions, setSelectedJobFunctions] = useState([]);
  const [jobFunctionInput, setJobFunctionInput] = useState('');
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [allLocationsToggle, setAllLocationsToggle] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [datePostedFilter, setDatePostedFilter] = useState('all');
  const [yearsExperienceFilter, setYearsExperienceFilter] = useState('all');

  // Fetch user profile to get default filters
  const fetchUserProfile = async () => {
    try {
      const storedToken = token || localStorage.getItem('auth_token');
      if (!storedToken) return;

      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: { 'token': storedToken }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          setUserProfile(data.profile);

          // Set defaults if currently empty
          const targetRole = data.profile.preferences?.target_role || data.profile.targetRole;
          const targetRoles = data.profile.target_roles || [];
          const savedJobFunctions = data.profile.preferences?.job_functions || [];

          // Initialize roles from persistent target_roles if available, otherwise fallback to legacy
          if (targetRoles.length > 0) {
            setSelectedJobFunctions(targetRoles);
          }
          // Disable auto-population of filters to allow viewing all jobs by default
          /*
          if (savedJobFunctions && savedJobFunctions.length > 0) {
            setSelectedJobFunctions(savedJobFunctions);
          } else if (targetRole) {
            setSelectedJobFunctions([targetRole]);
          }

          if (targetRole && !searchKeyword) {
            setSearchKeyword(targetRole);
          }
          */

          // Disable auto-population of locationFilter to allow all jobs to appear by default
          // const preferredLocation = data.profile.preferences?.preferred_locations || data.profile.address?.city || data.profile.city;
          // if (preferredLocation && !locationFilter) {
          //   setLocationFilter(preferredLocation);
          // }
        }
      }
    } catch (err) {
      console.error('Error fetching user profile for filters:', err);
    }
  };


  // Fetch jobs from API
  const fetchJobs = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/api/jobs?page=${page}&limit=20&sort=${sortBy}`;

      if (countryFilter && countryFilter !== 'all') {
        url += `&country=${countryFilter}`;
      }

      if (searchKeyword) {
        url += `&search=${encodeURIComponent(searchKeyword)}`;
      }

      if (locationFilter) {
        url += `&location=${encodeURIComponent(locationFilter)}`;
      }

      if (workTypeFilter && workTypeFilter !== 'all') {
        url += `&type=${workTypeFilter}`;
      }

      if (sponsorshipFilter === 'visa-friendly') {
        url += `&visa=true`;
      }

      // Add advanced filters to query
      if (selectedJobFunctions.length > 0) {
        url += `&job_functions=${encodeURIComponent(selectedJobFunctions.join(','))}`;
      }
      if (selectedExperience.length > 0) {
        url += `&experience=${encodeURIComponent(selectedExperience.join(','))}`;
      }
      if (selectedCities.length > 0) {
        url += `&cities=${encodeURIComponent(selectedCities.join(','))}`;
      }
      if (datePostedFilter !== 'all') {
        url += `&date_posted=${datePostedFilter}`;
      }
      if (salaryFilter !== 'all') {
        url += `&salary=${salaryFilter}`;
      }

      console.log('Fetching jobs from:', url);

      const headers = {};
      // Add token for personalized match scores
      if (token) {
        headers['token'] = token;
      } else {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) headers['token'] = storedToken;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      const jobsArray = data.jobs || [];

      if (jobsArray.length > 0) {
        const mappedJobs = jobsArray.map(job => ({
          id: job.id || job._id || job.externalId,
          title: job.title,
          company: job.company,
          location: job.location,
          salaryRange: job.salaryRange || job.salary || 'Competitive',
          description: job.description,
          type: job.type || 'onsite',
          visaTags: job.visaTags || [],
          categoryTags: job.categoryTags || [],
          highPay: job.highPay || false,
          matchScore: job.matchScore || 0,
          sourceUrl: job.sourceUrl || job.url
        }));
        setJobs(mappedJobs);

        if (data.pagination) {
          setPagination(data.pagination);
        } else {
          const total = data.total || mappedJobs.length;
          setPagination({
            page: page,
            limit: 20,
            total,
            pages: Math.ceil(total / 20)
          });
        }
        console.log('Loaded', mappedJobs.length, 'jobs');
      } else {
        setJobs([]);
        setPagination(data.pagination || { page: 1, limit: 20, total: jobsArray.length, pages: 1 });
        setError('No jobs found matching your filters');
      }

      if (data.recommendedFilters) {
        setRecommendedTags(data.recommendedFilters);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(`Failed to load jobs: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch job stats
  const fetchJobStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/jobs/stats/summary`);
      const data = await response.json();
      // Handle both {success, stats} and direct stats response
      if (data.stats) {
        setJobStats(data.stats);
      } else if (data.totalJobs !== undefined) {
        setJobStats(data);
      }
    } catch (error) {
      console.error('Error fetching job stats:', error);
    }
  };

  // Initial fetch on component mount
  // Fetch jobs when filters or page change
  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, countryFilter, workTypeFilter, sponsorshipFilter, selectedJobFunctions, selectedExperience, selectedCities, datePostedFilter, salaryFilter, sortBy]);

  // Debounced keyword search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Persist the search keyword
      localStorage.setItem('last_search_keyword', searchKeyword);

      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchJobs(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKeyword, locationFilter]);

  // Initial fetch for stats and profile
  useEffect(() => {
    fetchJobStats();
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  // Round-robin interleave: spread jobs so same company never appears consecutively.
  // Groups jobs by company, then picks one from each group in rotation until all are placed.
  const interleaveByCompany = (jobsList) => {
    const groups = {};
    jobsList.forEach(job => {
      const key = (job.company || 'unknown').toLowerCase().trim();
      if (!groups[key]) groups[key] = [];
      groups[key].push(job);
    });
    const buckets = Object.values(groups);
    const result = [];
    let remaining = buckets.filter(b => b.length > 0);
    while (remaining.length > 0) {
      remaining.forEach(bucket => {
        result.push(bucket.shift());
      });
      remaining = remaining.filter(b => b.length > 0);
    }
    return result;
  };

  // Jobs are filtered on the server; interleave client-side for display variety
  const displayJobs = interleaveByCompany(jobs);

  const getWorkTypeIcon = (type) => {
    switch (type) {
      case 'remote': return <Home className="w-3 h-3" />;
      case 'hybrid': return <Building2 className="w-3 h-3" />;
      case 'onsite': return <Briefcase className="w-3 h-3" />;
      default: return <Briefcase className="w-3 h-3" />;
    }
  };


  const clearFilters = () => {
    // We preserve searchKeyword as requested by user ("save it till he changes it")
    setLocationFilter('');
    setCountryFilter('all'); // Changed from 'us' to 'all'
    setSponsorshipFilter('all');
    setWorkTypeFilter('all');
    setSelectedJobFunctions([]);
    setSelectedExperience([]);
    setAllLocationsToggle(false);
    setSelectedCities([]);
    setSalaryFilter('all');
    setIndustryFilter('all');
    setDatePostedFilter('all');
    setCurrentPage(1);
  };

  const saveJobPreferences = async (roles) => {
    try {
      const storedToken = token || localStorage.getItem('auth_token');
      if (!storedToken) return;

      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': storedToken
        },
        body: JSON.stringify({
          target_roles: roles,
          preferences: {
            ...userProfile?.preferences,
            job_functions: roles
          }
        })
      });

      if (response.ok) {
        console.log('Job preferences saved successfully');
        // Refresh local profile state to avoid extra fetch
        setUserProfile(prev => ({
          ...prev,
          target_roles: roles,
          preferences: {
            ...prev?.preferences,
            job_functions: roles
          }
        }));
      }
    } catch (err) {
      console.error('Error saving job preferences:', err);
    }
  };

  const toggleJobFunction = (role) => {
    const updated = selectedJobFunctions.includes(role)
      ? selectedJobFunctions.filter(r => r !== role)
      : [...selectedJobFunctions, role];

    setSelectedJobFunctions(updated);
    // Auto-save immediately for premium experience
    saveJobPreferences(updated);
  };

  const handleConfirmJobFunctions = () => {
    saveJobPreferences(selectedJobFunctions);
    fetchJobs(1);
  };

  const hasActiveFilters = searchKeyword || locationFilter || countryFilter !== 'all' || sponsorshipFilter !== 'all' || workTypeFilter !== 'all';

  // Map jobs to the new component format
  const mappedJobs = displayJobs.map(job => ({
    id: job.id,
    company: job.company,
    title: job.title,
    logo: job.logo ? <img src={job.logo} alt={job.company} className="w-full h-full object-contain" /> : <div className="w-full h-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">{job.company[0]}</div>,
    job_description: job.fullDescription || job.description || "No description available.",
    salary: job.salaryRange || job.salary || "Competitive",
    location: job.location || "USA",
    remote: job.remoteType || "Hybrid",
    job_time: job.jobType || "Full-time",
    sourceUrl: job.sourceUrl
  }));

  const handleJobClick = (job) => {
    navigate(`/ai-ninja/jobs/${job.id}`);
  };

  return (
    <div className="jobs-page-content p-4 md:p-8 max-w-7xl mx-auto bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {searchKeyword || locationFilter || selectedJobFunctions.length > 0 ? "Filtered Jobs" : "All Jobs"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {searchKeyword || locationFilter ? `Showing results for "${searchKeyword || locationFilter}"` : "Showing all 110,000+ available roles across the globe"}
          </p>
        </div>
        <div className="bg-secondary text-muted-foreground px-4 py-2 rounded-md text-sm font-medium border border-border shadow-sm">
          {pagination.total.toLocaleString()} matching jobs
        </div>
      </div>

      {/* Filters Section */}
      <section className="mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar Row */}
          <div className="flex flex-col md:flex-row items-stretch gap-2">
            {/* Search Box */}
            <div className="relative flex-[1.8] bg-background rounded-md shadow-sm border border-border h-11 flex items-center px-4 focus-within:ring-1 focus-within:ring-foreground transition-all">
              <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
              <Input
                placeholder="Search jobs..."
                className="border-0 focus-visible:ring-0 bg-transparent text-sm w-full h-full p-0 shadow-none"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>

            {/* Experience Box */}
            <div className="bg-background rounded-md shadow-sm border border-border h-11 flex items-center min-w-[140px] focus-within:ring-1 focus-within:ring-foreground transition-all">
              <Select value={selectedExperience[0] || 'all'} onValueChange={(val) => setSelectedExperience(val === 'all' ? [] : [val])}>
                <SelectTrigger className="border-0 focus:ring-0 shadow-none bg-transparent text-sm gap-2 h-full flex-1 px-4">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Experience</SelectItem>
                  <SelectItem value="Intern">Intern</SelectItem>
                  <SelectItem value="Entry">Entry Level</SelectItem>
                  <SelectItem value="Mid">Mid Level</SelectItem>
                  <SelectItem value="Senior">Senior Level</SelectItem>
                  <SelectItem value="Director">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Box */}
            <div className="relative flex-1 bg-background rounded-md shadow-sm border border-border h-11 flex items-center px-4 focus-within:ring-1 focus-within:ring-foreground transition-all">
              <MapPin className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
              <Input
                placeholder="Location..."
                className="border-0 focus-visible:ring-0 bg-transparent text-sm w-full h-full p-0 shadow-none"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={() => fetchJobs(1)}
              className="vercel-button h-11 px-8 shrink-0"
            >
              Search
            </Button>
          </div>

          {/* Filter Tags Row */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setWorkTypeFilter('all');
                setSearchKeyword('');
                setLocationFilter('');
                setSelectedJobFunctions([]);
                localStorage.removeItem('last_search_keyword');
                setCurrentPage(1);
                fetchJobs(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${workTypeFilter === 'all' && !searchKeyword && !locationFilter
                ? 'bg-foreground text-background shadow-sm'
                : 'bg-secondary border border-border text-foreground hover:bg-muted'
                }`}
            >
              All Jobs
            </button>

            {[
              { label: 'Full-time', value: 'full_time' },
              { label: 'Contract', value: 'contract' },
              { label: 'Internship', value: 'internship' },
              { label: 'Cap Exempt', value: 'cap_exempt' },
              { label: 'Startups', value: 'startups' },
              { label: 'Visa Sponsoring', value: 'visa-friendly' }
            ].map((tag) => (
              <button
                key={tag.value}
                onClick={() => {
                  if (tag.value === 'visa-friendly') {
                    setSponsorshipFilter(sponsorshipFilter === 'visa-friendly' ? 'all' : 'visa-friendly');
                  } else {
                    setWorkTypeFilter(workTypeFilter === tag.value ? 'all' : tag.value);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${(workTypeFilter === tag.value || (tag.value === 'visa-friendly' && sponsorshipFilter === 'visa-friendly'))
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-secondary border border-border text-foreground hover:bg-muted'
                  }`}
              >
                {tag.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground text-xs gap-1.5">
                <X className="w-3.5 h-3.5" /> Reset Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job List Section */}
      <section className="job-list-section">
        <div className="container p-0">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm font-medium">Loading jobs...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <h3 className="text-lg font-medium text-foreground mb-1">Unable to load jobs</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => fetchJobs(1)} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" /> Try Again
              </Button>
            </div>
          )}

          {/* Job List */}
          {!isLoading && !error && (
            <>
              <div className="mt-6">
                <JobListingComponent
                  jobs={mappedJobs}
                  onJobClick={handleJobClick}
                />
              </div>

              {displayJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-md bg-secondary/30">
                  <Filter className="w-8 h-8 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium text-foreground">No jobs found</h3>
                  <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
                  <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
                </div>
              )}

              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8 pb-12">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    Page {currentPage} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPage(prev => Math.min(pagination.pages, prev + 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

    </div>
  );
};

export default Jobs;

