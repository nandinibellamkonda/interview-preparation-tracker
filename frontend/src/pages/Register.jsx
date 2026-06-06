import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, ArrowRight, ArrowLeft, Check, User, Mail, Lock, Eye, EyeOff, Building, GraduationCap, Briefcase } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    branch: '',
    role: '',
    graduationYear: new Date().getFullYear() + 1
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'graduationYear' ? Number(value) : value
    }));
  };

  const validateStep = () => {
    setLocalError('');
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setLocalError('All fields are required.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('Passwords do not match.');
        return false;
      }
      if (formData.password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.fullName || !formData.college) {
        setLocalError('Name and College are required.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.branch) {
        setLocalError('Please select or specify your department branch.');
        return false;
      }
    } else if (step === 4) {
      if (!formData.role) {
        setLocalError('Please select or specify your target career role.');
        return false;
      }
    } else if (step === 5) {
      if (!formData.graduationYear) {
        setLocalError('Please specify your graduation year.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setLocalError('');
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setLocalError('');

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        college: formData.college,
        branch: formData.branch,
        role: formData.role,
        graduationYear: formData.graduationYear
      });
    } catch (err) {
      console.error('Registration error:', err);
      setLocalError(err.message || 'Onboarding failed.');
    } finally {
      setLoading(false);
    }
  };

  const stepsLabel = [
    { title: 'Credentials', icon: Lock },
    { title: 'Profile', icon: User },
    { title: 'Branch', icon: Building },
    { title: 'Role', icon: Briefcase },
    { title: 'Graduation', icon: GraduationCap }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl glass rounded-2xl shadow-2xl p-8 relative z-10 border border-slate-800 animate-fade-in">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">PrepPilot AI</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Candidate Onboarding</p>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {stepsLabel.map((s, idx) => {
              const Icon = s.icon;
              const isCompleted = step > idx + 1;
              const isActive = step === idx + 1;
              return (
                <div key={idx} className="flex flex-col items-center z-10 relative flex-1">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm border transition-all ${
                    isCompleted ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' :
                    isActive ? 'bg-slate-800 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/10' :
                    'bg-[#161B26] border-slate-700 text-slate-500'
                  }`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4.5 w-4.5" />}
                  </div>
                  <span className={`text-[10px] mt-2 font-semibold tracking-wider uppercase hidden md:inline ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>{s.title}</span>
                </div>
              );
            })}
            {/* Connecting lines */}
            <div className="absolute top-[18px] left-[5%] right-[5%] h-[2px] bg-slate-800 -z-10">
              <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${((step - 1) / (stepsLabel.length - 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {localError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/40 text-red-400 text-sm flex items-start gap-2">
            <span className="font-semibold">Error:</span> {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Account setup */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-left border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-lg font-bold text-white">Create Your Account</h3>
                <p className="text-xs text-slate-500">Provide an email and secure credentials to lock in your metrics.</p>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <input
                    name="email"
                    autoComplete="email"
                    type="email"
                    className="w-full bg-[#161B26] border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm font-semibold mb-2">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                      <Lock className="h-4.5 w-4.5" />
                    </span>
                    <input
                      name="password"
                      autoComplete="new-password"
                      type={showPassword ? 'text' : 'password'}
                      className="w-full bg-[#161B26] border border-slate-700/50 rounded-xl py-3 pl-10 pr-12 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 inline-flex items-center text-slate-400"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-semibold mb-2">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                      <Lock className="h-4.5 w-4.5" />
                    </span>
                    <input
                      name="confirmPassword"
                      autoComplete="new-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full bg-[#161B26] border border-slate-700/50 rounded-xl py-3 pl-10 pr-12 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 inline-flex items-center text-slate-400"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Personal details */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-left border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-lg font-bold text-white">Academic Details</h3>
                <p className="text-xs text-slate-500">How should we label your reports and placement profiles?</p>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <User className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    className="w-full bg-[#161B26] border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Nandini Bellamkonda"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-2">College/University</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Building className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    name="college"
                    className="w-full bg-[#161B26] border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Indian Institute of Technology"
                    value={formData.college}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Department branch */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-left border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-lg font-bold text-white">Select Your Department</h3>
                <p className="text-xs text-slate-500">Choose your academic stream to configure topic trackers.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'].map((branchName) => (
                  <button
                    key={branchName}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, branch: branchName }))}
                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                      formData.branch === branchName ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-[#161B26] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {branchName}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-slate-400 text-xs font-semibold mb-2">Or type custom branch:</label>
                <input
                  type="text"
                  name="branch"
                  className="w-full bg-[#161B26] border border-slate-700/50 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Other Engineering Stream"
                  value={formData.branch}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Target role */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-left border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-lg font-bold text-white">Target Placement Role</h3>
                <p className="text-xs text-slate-500">Specify your career goal to align roadmap recommendations.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Software Engineer', 'Full Stack Developer', 'Frontend Engineer', 'Backend Engineer', 'Data Engineer', 'Product Manager'].map((roleName) => (
                  <button
                    key={roleName}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: roleName }))}
                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                      formData.role === roleName ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-[#161B26] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {roleName}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-slate-400 text-xs font-semibold mb-2">Or specify custom role:</label>
                <input
                  type="text"
                  name="role"
                  className="w-full bg-[#161B26] border border-slate-700/50 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Site Reliability Engineer"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Graduation Year */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-left border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-lg font-bold text-white">Graduation Timeline</h3>
                <p className="text-xs text-slate-500">When will you complete your college degree?</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[2025, 2026, 2027, 2028, 2029].map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, graduationYear: year }))}
                    className={`py-3 px-6 rounded-xl border text-sm font-semibold transition-all ${
                      formData.graduationYear === year ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#161B26] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Class of {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Wizard Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="py-3 px-5 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div /> // spacing placeholder
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    Complete Onboarding
                    <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-all">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
