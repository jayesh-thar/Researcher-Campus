import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, BookOpen, Building2, User, Search, Plus, X, 
  MapPin, Globe, Check, ArrowRight, Sparkles, Code2, Award, CheckCircle2 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';

const POPULAR_STATES: Record<string, string[]> = {
  'California': ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose', 'Palo Alto'],
  'Massachusetts': ['Boston', 'Cambridge', 'Worcester'],
  'Washington': ['Seattle', 'Bellevue', 'Redmond'],
  'New York': ['New York City', 'Buffalo', 'Ithaca'],
  'Texas': ['Austin', 'Dallas', 'Houston'],
  'Illinois': ['Chicago', 'Urbana-Champaign'],
  'International / Global': ['London', 'Paris', 'Tokyo', 'Singapore', 'Zurich', 'Toronto', 'Berlin'],
  'Any State': ['Any City']
};

const POPULAR_SKILLS = [
  'Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'LightGBM',
  'HuggingFace', 'CUDA', 'Docker', 'FastAPI', 'LaTeX',
  'C++', 'R', 'Pandas', 'NumPy', 'React',
  'TypeScript', 'Node.js', 'Kubernetes', 'AWS', 'GCP',
  'LangChain', 'OpenCV', 'MATLAB', 'Julia', 'Git'
];

const DOMAINS = [
  '💻 Software & Distributed Systems',
  '🧠 Artificial Intelligence & Machine Learning',
  '🏥 Healthcare & Biomedical ML',
  '🔒 Cybersecurity & Cryptography',
  '🌐 Networks, IoT & Cloud Computing',
  '💬 NLP & Large Language Models',
  '👁️ Computer Vision & Multimedia',
  '⚛️ Quantum Computing & Algorithms',
  '🔬 Bio-informatics & Computational Biology'
];

export function Onboarding() {
  const navigate = useNavigate();

  // If user has already completed onboarding, redirect straight to dashboard
  useEffect(() => {
    const storedUserStr = localStorage.getItem('user');
    if (storedUserStr) {
      try {
        const u = JSON.parse(storedUserStr);
        if (u.isCompletedOnboarding) {
          navigate('/dashboard', { replace: true });
        }
      } catch {}
    }
  }, [navigate]);

  // Form State
  const [persona, setPersona] = useState<string>('RESEARCHER');
  const [primaryDomain, setPrimaryDomain] = useState<string>('🧠 Artificial Intelligence & Machine Learning');
  const [customDomain, setCustomDomain] = useState<string>('');
  
  // Location & Venue Preference State
  const [venueType, setVenueType] = useState<string>('Peer-Reviewed Conference');
  const [selectedState, setSelectedState] = useState<string>('California');
  const [selectedCities, setSelectedCities] = useState<string[]>(['Any City']);
  const [customCityInput, setCustomCityInput] = useState<string>('');
  const [includeOutsideState, setIncludeOutsideState] = useState<boolean>(true);

  // Tech Stack & Skills State
  const [techStack, setTechStack] = useState<string[]>(['Python', 'PyTorch']);
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [customSkillInput, setCustomSkillInput] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Skill tag management
  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
    }
    setCustomSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setTechStack(techStack.filter((s) => s !== skillToRemove));
  };

  // City selection management
  const toggleCity = (city: string) => {
    if (city === 'Any City') {
      setSelectedCities(['Any City']);
      return;
    }
    const filtered = selectedCities.filter((c) => c !== 'Any City');
    if (filtered.includes(city)) {
      const remaining = filtered.filter((c) => c !== city);
      setSelectedCities(remaining.length > 0 ? remaining : ['Any City']);
    } else {
      setSelectedCities([...filtered, city]);
    }
  };

  const addCustomCity = () => {
    if (customCityInput.trim()) {
      const city = customCityInput.trim();
      const filtered = selectedCities.filter((c) => c !== 'Any City');
      if (!filtered.includes(city)) {
        setSelectedCities([...filtered, city]);
      }
      setCustomCityInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const finalDomain = customDomain.trim() || primaryDomain;
    const finalVenuePreference = {
      venueType,
      state: selectedState,
      cities: selectedCities,
      includeOutsideState
    };

    try {
      const response = await api.put('/user/onboarding', {
        persona,
        primaryDomain: finalDomain,
        targetVenuePreference: finalVenuePreference,
        techStack
      });

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Onboarding setup error:', err);
      setError(err.response?.data?.error || 'Failed to complete profile setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = POPULAR_SKILLS.filter(
    (s) => !techStack.includes(s) && s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 flex flex-col space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <Badge variant="info" className="mx-auto">Researcher Campus • Step 1</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Set Up Your Academic Profile
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Configure your research persona, venue location preferences, and core tech stack so our AI co-pilot and literature scanner can tailor their recommendations.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Academic Persona */}
          <Card className="p-6 border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-navy-800" />
                <span>1. Academic Persona</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your primary academic standing or role.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'STUDENT', label: 'Student', desc: 'Undergrad / Master’s' },
                { id: 'PHD', label: 'PhD Scholar', desc: 'Doctoral Candidate' },
                { id: 'RESEARCHER', label: 'Researcher', desc: 'Postdoc / Fellow' },
                { id: 'PROFESSOR', label: 'Professor', desc: 'Principal Investigator' },
                { id: 'INDUSTRY', label: 'Industry R&D', desc: 'Applied Scientist / ML' },
                { id: 'INDEPENDENT', label: 'Independent', desc: 'Self-directed Scholar' }
              ].map((p) => {
                const isSelected = persona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersona(p.id)}
                    className={`p-3.5 rounded border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-navy-800 bg-navy-50/60 ring-1 ring-navy-800'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">{p.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-navy-800" />}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Section 2: Primary Research Domain */}
          <Card className="p-6 border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-navy-800" />
                <span>2. Primary Research Domain</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose your field of study or specify a custom domain.
              </p>
            </div>

            <div className="space-y-3">
              <select
                value={primaryDomain}
                onChange={(e) => {
                  setPrimaryDomain(e.target.value);
                  setCustomDomain('');
                }}
                className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-800"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <div className="pt-1">
                <Input
                  label="Or specify a custom niche domain (optional):"
                  placeholder="e.g. Federated Clinical NLP for Rare Diseases"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Section 3: Target Venue & Location Preference */}
          <Card className="p-6 border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-navy-800" />
                <span>3. Target Publication Venue & Location Preference</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specify your preferred venue format and geographical preference for in-person / hybrid conferences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Venue Format Preference:
                </label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-800"
                >
                  <option value="Peer-Reviewed Conference">Peer-Reviewed Conference (IEEE, ACM)</option>
                  <option value="Academic Journal">Academic Journal (Springer, Nature, Elsevier)</option>
                  <option value="Symposium / Workshop">Workshop or Specialized Symposium</option>
                  <option value="Any Format">Any Peer-Reviewed Format</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred State / Region:
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCities(['Any City']);
                  }}
                  className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-800"
                >
                  {Object.keys(POPULAR_STATES).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City Selection */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-700">
                Preferred Cities in {selectedState}:
              </label>
              <div className="flex flex-wrap gap-2">
                {(POPULAR_STATES[selectedState] || ['Any City']).map((city) => {
                  const isCitySelected = selectedCities.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleCity(city)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center space-x-1 border ${
                        isCitySelected
                          ? 'bg-navy-800 text-white border-navy-800'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {isCitySelected && <Check className="w-3 h-3 mr-0.5" />}
                      <span>{city}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add custom city */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Add another city in this state..."
                  value={customCityInput}
                  onChange={(e) => setCustomCityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomCity();
                    }
                  }}
                  className="text-xs border border-slate-300 rounded px-3 py-1.5 flex-1 focus:outline-none focus:ring-1 focus:ring-navy-800"
                />
                <Button type="button" size="sm" variant="outline" onClick={addCustomCity}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </Button>
              </div>
            </div>

            {/* Checkbox toggle: Conferences outside this state */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={includeOutsideState}
                  onChange={(e) => setIncludeOutsideState(e.target.checked)}
                  className="w-4 h-4 text-navy-800 rounded border-slate-300 focus:ring-navy-800"
                />
                <span>Also consider top tier conferences outside this specific state / region</span>
              </label>
            </div>
          </Card>

          {/* Section 4: Tech Stack & Skill Tags (Job Platform Style) */}
          <Card className="p-6 border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-navy-800" />
                <span>4. Tech Stack & Methodology Skills</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select or search tools, libraries, and frameworks you use (used in Stage 4 Implementation Roadmap).
              </p>
            </div>

            {/* Selected Skills Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your Selected Skills ({techStack.length}):
              </label>
              {techStack.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No skills selected yet. Choose from below or type custom ones.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center space-x-1.5 bg-navy-800 text-white text-xs px-2.5 py-1 rounded font-medium shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-300 focus:outline-none"
                        title={`Remove ${skill}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Search and Quick Add */}
            <div className="space-y-2 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter or search skills (e.g. PyTorch, Docker, C++)..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-navy-800"
                />
              </div>

              {/* Filtered suggestions */}
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded">
                {filteredSkills.slice(0, 16).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="text-xs bg-white border border-slate-200 hover:border-navy-800 text-slate-700 px-2 py-0.5 rounded transition-all flex items-center space-x-1 hover:text-navy-800"
                  >
                    <Plus className="w-3 h-3 text-slate-400" />
                    <span>{skill}</span>
                  </button>
                ))}
              </div>

              {/* Add custom skill input */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Type a custom skill or library..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(customSkillInput);
                    }
                  }}
                  className="text-xs border border-slate-300 rounded px-3 py-1.5 flex-1 focus:outline-none focus:ring-1 focus:ring-navy-800"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addSkill(customSkillInput)}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Custom
                </Button>
              </div>
            </div>
          </Card>

          {/* Submit Action Button */}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full py-3.5 text-sm font-semibold tracking-wide"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Profile & Enter Research Dashboard
            </Button>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              You can adjust these settings at any time in your Profile Settings.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
