import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, BookOpen, MapPin, Check, ArrowRight, Sparkles, Building2, User 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Comprehensive India States & UTs with 6-7 Academic / Tech Hub Cities
const INDIA_STATES_AND_CITIES: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Navi Mumbai', 'Kolhapur'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Manipal', 'Shivamogga'],
  'Delhi (NCT)': ['New Delhi', 'North Delhi', 'South Delhi', 'Dwarka', 'Rohini', 'Connaught Place'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Vellore', 'Tirunelveli'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Secunderabad'],
  'Gujarat': ['Ahmedabad', 'Gandhinagar', 'Vadodara', 'Surat', 'Rajkot', 'Bhavnagar', 'Anand'],
  'Uttar Pradesh': ['Noida', 'Lucknow', 'Kanpur', 'Varanasi', 'Greater Noida', 'Agra', 'Prayagraj'],
  'West Bengal': ['Kolkata', 'Kharagpur', 'Durgapur', 'Siliguri', 'Howrah', 'Asansol'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Pilani'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Rohtak', 'Hisar', 'Sonipat'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Berhampur', 'Balasore'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kakinada', 'Nellore'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Nagaon'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua'],
  'Uttarakhand': ['Dehradun', 'Roorkee', 'Haridwar', 'Nainital', 'Haldwani', 'Rishikesh'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Porvorim'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Kullu', 'Hamirpur'],
  'Chandigarh': ['Chandigarh', 'Mohali', 'Panchkula', 'Manimajra', 'IT Park'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Oulgaret', 'Yanam', 'Mahe'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro'],
  'Manipur': ['Imphal', 'Churachandpur', 'Thoubal', 'Bishnupur', 'Ukhrul'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Williamnagar'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Ravangla'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar', 'Belonia'],
  'Andaman & Nicobar': ['Port Blair', 'Havelock', 'Diglipur', 'Garacharma'],
  'Ladakh': ['Leh', 'Kargil', 'Diskit', 'Padum'],
  'Dadra & Nagar Haveli and Daman & Diu': ['Daman', 'Diu', 'Silvassa'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Amini', 'Andrott'],
  'All India (Any State)': ['Any City']
};

const RESEARCH_DOMAINS = [
  '🧠 Artificial Intelligence & Machine Learning',
  '💻 Software Engineering & Distributed Systems',
  '🏥 Healthcare Informatics & Biomedical ML',
  '🔒 Cybersecurity, Cryptography & Privacy',
  '🌐 Computer Networks, Cloud & IoT',
  '💬 NLP & Large Language Models',
  '👁️ Computer Vision, Graphics & Multimedia',
  '🤖 Robotics, Autonomous Systems & Control',
  '📊 Data Science, Analytics & Big Data',
  '⚛️ Quantum Computing & Theoretical CS',
  '⚡ Electrical, Electronics & Communication (VLSI/Embedded)',
  '🔬 Bioinformatics & Computational Biology',
  '📚 Educational Technology & Human-Computer Interaction (HCI)'
];

export function Onboarding() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

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
  
  // Location & Venue Preference State (India-focused)
  const [venueType, setVenueType] = useState<string>('Peer-Reviewed Conference (IEEE, ACM)');
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedCities, setSelectedCities] = useState<string[]>(['Any City']);
  const [includeOutsideState, setIncludeOutsideState] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const finalVenuePreference = {
      venueType,
      state: selectedState,
      cities: selectedCities,
      includeOutsideState
    };

    try {
      const response = await api.put('/user/onboarding', {
        persona,
        primaryDomain,
        targetVenuePreference: finalVenuePreference
      });

      if (response.data.user) {
        updateUser(response.data.user);
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Onboarding setup error:', err);
      setError(err.response?.data?.error || 'Failed to complete profile setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            Configure your research persona, domain, and preferred Indian publication venue locations so our AI co-pilot and venue matcher can tailor their recommendations.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              ✕
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
                Choose your core field of study and research discipline.
              </p>
            </div>

            <div>
              <select
                value={primaryDomain}
                onChange={(e) => setPrimaryDomain(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-navy-800 shadow-2xs"
              >
                {RESEARCH_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Section 3: Target Venue & Location Preference (India-Specific) */}
          <Card className="p-6 border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-navy-800" />
                <span>3. Target Publication Venue & Location Preference (India)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specify your preferred venue format and Indian State / UT for conference targeting.
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
                  <option value="Peer-Reviewed Conference (IEEE, ACM)">Peer-Reviewed Conference (IEEE, ACM, Springer)</option>
                  <option value="Academic Journal (Scopus, SCI, Nature)">Academic Journal (Scopus, SCI, Nature, Elsevier)</option>
                  <option value="Specialized Symposium / Workshop">Specialized Symposium / Workshop</option>
                  <option value="Any Peer-Reviewed Venue">Any Peer-Reviewed Venue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred State / UT (India):
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCities(['Any City']);
                  }}
                  className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-800"
                >
                  {Object.keys(INDIA_STATES_AND_CITIES).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City Selection (Top 6-7 Cities + Any City) */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700">
                Preferred Academic & Conference Cities in {selectedState}:
              </label>
              <div className="flex flex-wrap gap-2">
                {/* Any City Chip */}
                <button
                  type="button"
                  onClick={() => toggleCity('Any City')}
                  className={`px-3 py-1.5 rounded text-xs transition-colors font-medium border flex items-center space-x-1 ${
                    selectedCities.includes('Any City')
                      ? 'bg-navy-800 text-white border-navy-800'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {selectedCities.includes('Any City') && <Check className="w-3.5 h-3.5 mr-0.5" />}
                  <span>Any City</span>
                </button>

                {/* 6-7 City Chips */}
                {(INDIA_STATES_AND_CITIES[selectedState] || []).map((city) => {
                  const isCitySelected = selectedCities.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleCity(city)}
                      className={`px-3 py-1.5 rounded text-xs transition-colors font-medium border flex items-center space-x-1 ${
                        isCitySelected
                          ? 'bg-navy-800 text-white border-navy-800'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {isCitySelected && <Check className="w-3.5 h-3.5 mr-0.5" />}
                      <span>{city}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checkbox toggle: Conferences outside this state */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={includeOutsideState}
                  onChange={(e) => setIncludeOutsideState(e.target.checked)}
                  className="w-4 h-4 text-navy-800 rounded border-slate-300 focus:ring-navy-800"
                />
                <span>Also consider top tier national conferences outside this particular state / UT</span>
              </label>
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
              You can adjust these settings anytime in your Profile Settings.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
