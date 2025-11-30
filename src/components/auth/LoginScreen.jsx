import React, { useState } from 'react';
import { 
  Activity, ShieldCheck, ChevronRight, Eye, EyeOff, 
  AlertCircle, Phone, Mail, File, X, Download, Languages 
} from 'lucide-react';
import { useAuth, useLanguage } from '../../hooks/useAppState';
import { LanguageSelector } from '../LanguageSelector';
import { useTranslation } from 'react-i18next';

const ministryLogoUrl = '/ministry-logo.svg';
const jalsenseLogoUrl = '/jalsense-logo.svg';

export const LoginScreen = () => {
  const { login, authLoading, authError, setLoginError } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [role, setRole] = useState('technician');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegistry, setShowRegistry] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(null);

    if (role === 'guest') {
      login({ name: 'Guest Observer', role: 'public' }, language);
      return;
    }

    if (role === 'technician' && username === 'tech' && password === 'admin') {
      login({ name: 'Ramesh Kumar', role: 'technician' }, language);
    } else if (role === 'researcher' && username === 'research' && password === 'admin') {
      login({ name: 'Dr. Anjali Singh', role: 'researcher' }, language);
    } else {
      setLoginError('Invalid Credentials. Please check your inputs.');
    }
  };

  const integrations = [
    { id: 1, name: "Gram Panchayat Shivpur", status: "Connected", date: "2023-01-15" },
    { id: 2, name: "Gram Panchayat Rampur", status: "Connected", date: "2023-02-10" },
    { id: 3, name: "Gram Panchayat Lakhanpur", status: "Maintenance", date: "2023-03-05" },
    { id: 4, name: "Gram Panchayat Bigenhalli", status: "Connected", date: "2023-04-20" },
    { id: 5, name: "Gram Panchayat Jolapur", status: "Offline", date: "2023-05-12" }
  ];

  const handleDownload = () => {
    const textContent = `GRAM JAL JEEVAN INTEGRATION REPORT\nGenerated: ${new Date().toLocaleString()}\n\n` + 
      integrations.map(i => `${i.id}. ${i.name} - ${i.status} (Installed: ${i.date})`).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Gram_Panchayat_Integrations.txt"; 
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isGuest = role === 'guest';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" style={{ fontFamily: "'Noto Sans', 'Inter', 'Segoe UI', sans-serif" }}>
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row border border-gray-200 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {/* Left Side - Brand & Government Authority */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 p-10 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Government Authority Logo - At Top */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-green-600 transform hover:scale-105 transition-all duration-300">
              <img 
                src={ministryLogoUrl} 
                alt="Ministry of Jal Shakti, Government of India" 
                className="w-full h-auto object-contain max-w-md" 
              />
            </div>
            
            {/* Jalsense App Logo - In Middle */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-amber-500 transform hover:scale-105 transition-all duration-300">
              <img 
                src={jalsenseLogoUrl} 
                alt="Jalsense Logo" 
                className="w-full h-auto object-contain max-w-md" 
              />
            </div>
            
            {/* Mission Text - At Bottom */}
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border-l-4 border-amber-500 shadow-xl">
              <p className="text-white text-2xl font-black tracking-wide leading-tight uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Gram Jal Jeevan Mission
              </p>
              <p className="text-amber-400 text-sm font-bold mt-2 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Rural Water Supply O&M Platform
              </p>
            </div>
          </div>
          
          {/* Decorative Elements - Government Colors */}
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-600 rounded-full opacity-10 blur-3xl"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center relative bg-gradient-to-br from-white to-gray-50">
          {!showRegistry ? (
            <>
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-black text-blue-950 mb-1 uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Welcome Back
                  </h2>
                  <p className="text-black font-bold uppercase text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>Secure Authentication Portal</p>
                </div>
                <div className="w-40">
                  <label className="block text-xs font-black text-blue-950 uppercase mb-1 flex items-center gap-1 tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <Languages size={14}/> {t('language.selectorLabel')}
                  </label>
                  <LanguageSelector
                    value={language}
                    onChange={changeLanguage}
                    size="sm"
                    hideLabel
                  />
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-blue-950 uppercase mb-2 tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Select Role
                  </label>
                  <div className="relative">
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-3.5 rounded-lg border-2 border-gray-300 bg-white outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 appearance-none cursor-pointer font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <option value="technician">Technician</option>
                      <option value="researcher">Researcher</option>
                      <option value="guest">Guest Observer</option>
                    </select>
                    <div className="absolute right-3 top-4 pointer-events-none text-gray-600">
                      <ChevronRight size={18} className="rotate-90"/>
                    </div>
                  </div>
                  {isGuest && (
                    <p className="mt-2 text-2xs font-semibold text-green-700 uppercase tracking-widest">
                      Guest mode: no credentials required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black text-blue-950 uppercase mb-2 tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    User ID
                  </label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full p-3.5 rounded-lg border-2 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-300 font-medium shadow-sm hover:shadow-md ${isGuest ? 'border-dashed border-green-300 bg-green-50 text-green-700 cursor-not-allowed' : 'border-gray-300 focus:scale-105'}`}
                    placeholder={isGuest ? 'Guest access enabled' : 'Enter your ID'}
                    disabled={isGuest}
                    required={!isGuest}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-blue-950 uppercase mb-2 tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full p-3.5 rounded-lg border-2 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-300 font-medium shadow-sm hover:shadow-md ${isGuest ? 'border-dashed border-green-300 bg-green-50 text-green-700 cursor-not-allowed' : 'border-gray-300 focus:scale-105'}`}
                      placeholder={isGuest ? 'Not required for guest mode' : 'Enter Password'}
                      disabled={isGuest}
                      required={!isGuest}
                    />
                    {!isGuest && (
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-blue-950 transition-all duration-300 transform hover:scale-110"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    )}
                  </div>
                </div>

                {authError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-red-700 font-bold">
                      <AlertCircle size={18} /> {authError}
                    </div>
                    <div className="text-xs text-gray-600 border-t border-red-100 pt-2 mt-2">
                      <div className="font-semibold mb-1">Trouble Logging in? Contact Ministry:</div>
                      <div className="flex items-center gap-2"><Phone size={12}/> Helpline: 1800-JAL-SHAKTI</div>
                      <div className="flex items-center gap-2"><Mail size={12}/> Support: help@jaljeevan.gov.in</div>
                    </div>
                  </div>
                )}

                <button 
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-4 rounded-full transition-all duration-300 flex justify-center items-center gap-2 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 uppercase tracking-widest text-sm"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {authLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Access Dashboard <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <button 
                  onClick={() => setShowRegistry(true)}
                  className="w-full text-blue-900 hover:text-amber-600 text-sm font-bold flex items-center justify-center gap-2 hover:underline transition-all duration-300 uppercase tracking-wide transform hover:scale-105"
                >
                  <File size={16} className="transition-transform group-hover:rotate-12" /> View Active Integrations List
                </button>
              </div>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-blue-950 text-lg uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>Integration Registry</h3>
                <button onClick={() => setShowRegistry(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20}/>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto border-2 rounded-xl bg-gray-50 p-2 space-y-2 mb-4">
                {integrations.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-md flex justify-between items-center hover:shadow-xl transition-all duration-300 transform hover:scale-102 cursor-pointer">
                    <div>
                      <div className="font-bold text-sm text-black">{item.name}</div>
                      <div className="text-xs text-gray-500">Installed: {item.date}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      item.status === 'Connected' ? 'bg-green-100 text-green-700' : 
                      item.status === 'Offline' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white py-3 rounded-full font-black flex justify-center items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <Download size={18} className="transition-transform group-hover:translate-y-1" /> Download Report (PDF)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

