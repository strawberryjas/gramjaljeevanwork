import React from 'react';
import { 
  Activity, Droplet, Zap, TrendingUp, Star, Award, ShieldCheck,
  WifiOff, Clock, Users, BarChart3, AlertTriangle,
  Leaf, Sun, Gauge, RefreshCcw, Trophy, Target, Lightbulb,
  CheckCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Guest Dashboard - Public/Guest users (read-only, gamified overview)
export const GuestDashboard = ({ language, t, offlineMode, lastSync }) => {
  // Mock data for gamified elements
  const waterScore = 87;
  const totalPoints = 325;
  const achievements = [
    { name: "Clean Water Champion", points: 100, unlocked: true, icon: <Trophy size={20} className="text-yellow-500" /> },
    { name: "Zero Waste Hero", points: 75, unlocked: true, icon: <Leaf size={20} className="text-green-500" /> },
    { name: "Community Guardian", points: 150, unlocked: true, icon: <ShieldCheck size={20} className="text-blue-500" /> },
    { name: "Efficiency Master", points: 200, unlocked: false, icon: <Zap size={20} className="text-purple-500" /> },
  ];

  const weeklyPerformanceData = [
    { name: 'Day 1', quality: 85, uptime: 98 },
    { name: 'Day 2', quality: 88, uptime: 99 },
    { name: 'Day 3', quality: 90, uptime: 97 },
    { name: 'Day 4', quality: 89, uptime: 99 },
    { name: 'Day 5', quality: 92, uptime: 100 },
    { name: 'Day 6', quality: 91, uptime: 99 },
    { name: 'Day 7', quality: 93, uptime: 100 },
  ];

  const impactScoreData = [
    { name: 'Clean Water', value: 87, color: '#22C55E' },
    { name: 'Efficiency', value: 92, color: '#3B82F6' },
    { name: 'Reliability', value: 95, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            <Trophy size={28} className="text-yellow-500"/> Welcome Guest!
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <WifiOff size={14} /> {offlineMode ? 'Offline Mode Active' : 'Online Mode Active'} | Last Sync: {lastSync || 'Just now'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <RefreshCcw size={16} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Gamified Water Score */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-xl p-6 flex flex-col md:flex-row items-center justify-between animate-in fade-in zoom-in duration-500">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl font-black text-blue-700 border-4 border-yellow-400 shadow-inner animate-pulse">
              {waterScore}
            </div>
            <Star size={32} className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" fill="currentColor"/>
          </div>
          <div>
            <p className="text-4xl font-black uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Your Water Score
            </p>
            <p className="text-yellow-300 text-lg font-bold flex items-center gap-2">
              😊 Excellent! Keep up the great work.
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-xl font-bold">Total Points: {totalPoints}</p>
          <button className="mt-2 px-4 py-2 bg-yellow-400 text-blue-900 rounded-full text-sm font-bold hover:bg-yellow-300 transition-colors shadow-md">
            View Achievements
          </button>
        </div>
      </div>

      {/* Gamified Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-5 border-b-4 border-blue-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-blue-800 text-lg flex items-center gap-2">
              <Droplet size={24} className="text-blue-600"/> Water Delivered
            </h3>
            <span className="text-2xl">💧</span>
          </div>
          <p className="text-3xl font-black text-black">2.5M <span className="text-xl text-gray-600">Liters</span></p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '85%'}}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">85% of monthly target</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border-b-4 border-green-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-green-800 text-lg flex items-center gap-2">
              <Activity size={24} className="text-green-600"/> System Uptime
            </h3>
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-3xl font-black text-black">99.8<span className="text-xl text-gray-600">%</span></p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
            <div className="bg-green-600 h-2.5 rounded-full" style={{width: '99.8%'}}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Excellent reliability</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border-b-4 border-amber-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-amber-800 text-lg flex items-center gap-2">
              <Users size={24} className="text-amber-600"/> Families Served
            </h3>
            <span className="text-2xl">😊</span>
          </div>
          <p className="text-3xl font-black text-black">2,847</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
            <div className="bg-amber-600 h-2.5 rounded-full" style={{width: '90%'}}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">90% coverage in area</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border-b-4 border-red-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-red-800 text-lg flex items-center gap-2">
              <AlertTriangle size={24} className="text-red-600"/> Active Alerts
            </h3>
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-3xl font-black text-black">0 <span className="text-xl text-gray-600">Today</span></p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
            <div className="bg-red-600 h-2.5 rounded-full" style={{width: '0%'}}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">All systems nominal</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
        <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          <Award size={24} className="text-purple-600"/> Your Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className={`flex flex-col items-center p-4 rounded-lg shadow-md ${achievement.unlocked ? 'bg-gradient-to-br from-white to-gray-50 border border-gray-200' : 'bg-gray-100 border border-gray-300 opacity-70'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 ${achievement.unlocked ? 'bg-white shadow-inner' : 'bg-gray-200'}`}>
                {achievement.icon}
              </div>
              <p className={`font-bold text-center ${achievement.unlocked ? 'text-black' : 'text-gray-600'}`}>{achievement.name}</p>
              <p className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-500'}`}>{achievement.points} Points</p>
              {!achievement.unlocked && <span className="text-xs text-red-500 font-bold mt-1">LOCKED</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-emerald-500">
          <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-emerald-600"/> Weekly Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" className="text-xs text-gray-600"/>
              <YAxis className="text-xs text-gray-600"/>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
              />
              <Area type="monotone" dataKey="quality" stroke="#22C55E" fillOpacity={1} fill="url(#colorQuality)" name="Water Quality (%)"/>
              <Area type="monotone" dataKey="uptime" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUptime)" name="System Uptime (%)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Target size={24} className="text-blue-600"/> Impact Score
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={impactScoreData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {impactScoreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-5 flex items-center gap-4 transform hover:scale-105 transition-all duration-300">
          <Droplet size={40} className="text-blue-200"/>
          <div>
            <p className="text-3xl font-black">2.5M+</p>
            <p className="text-sm font-semibold">Liters Delivered</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl shadow-lg p-5 flex items-center gap-4 transform hover:scale-105 transition-all duration-300">
          <Users size={40} className="text-green-200"/>
          <div>
            <p className="text-3xl font-black">2,847+</p>
            <p className="text-sm font-semibold">Happy Families Served</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-xl shadow-lg p-5 flex items-center gap-4 transform hover:scale-105 transition-all duration-300">
          <Lightbulb size={40} className="text-amber-200"/>
          <div>
            <p className="text-3xl font-black">0</p>
            <p className="text-sm font-semibold">Complaints (30 Days)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
