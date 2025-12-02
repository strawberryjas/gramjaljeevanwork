import React, { useState } from 'react';
import {
  Phone, MapPin, Clock, CheckCircle, AlertCircle, User,
  Droplet, Gauge, Beaker, Wrench, FileText, XCircle, Search
} from 'lucide-react';

/**
 * ServiceRequestDashboard Component
 * Displays public complaints and service requests for technicians to manage
 */
export const ServiceRequestDashboard = ({ userRole, globalSearchQuery = '' }) => {
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending, in-progress, resolved
  const [activeVillage, setActiveVillage] = useState('all'); // all villages
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sync local search with global search when global search changes
  React.useEffect(() => {
    if (globalSearchQuery) {
      setSearchQuery(globalSearchQuery);
    }
  }, [globalSearchQuery]);
  
  // Use global search query if available, otherwise use local search
  const effectiveSearchQuery = globalSearchQuery || searchQuery;

  // Mock service requests data with village information
  const serviceRequests = [
    {
      id: 'REQ-1001',
      type: 'No Water Supply',
      priority: 'high',
      status: 'pending',
      customerName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      village: 'Ward 1',
      location: 'House 45, Main Distribution Area, Ward 1',
      distance: '1.2 km',
      description: 'No water supply since morning. Tank seems full but no water coming through pipes.',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      urgency: 'High',
      icon: Droplet
    },
    {
      id: 'REQ-1002',
      type: 'Low Water Pressure',
      priority: 'medium',
      status: 'in-progress',
      customerName: 'Sunita Devi',
      phone: '+91 98765 43211',
      village: 'Ward 2',
      location: 'House 78, Secondary Line Area, Ward 2',
      distance: '2.5 km',
      description: 'Very low water pressure in the morning hours. Takes too long to fill containers.',
      submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      assignedTo: 'Technician A',
      eta: '30 min',
      urgency: 'Medium',
      icon: Gauge
    },
    {
      id: 'REQ-1003',
      type: 'Dirty/Contaminated Water',
      priority: 'high',
      status: 'pending',
      customerName: 'Mohan Singh',
      phone: '+91 98765 43212',
      village: 'Ward 3',
      location: 'House 12, Extension Line Area, Ward 3',
      distance: '4.8 km',
      description: 'Water coming out is yellowish and has bad smell. Not safe for drinking.',
      submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      urgency: 'High',
      icon: Beaker
    },
    {
      id: 'REQ-1004',
      type: 'Pipeline Leakage',
      priority: 'high',
      status: 'in-progress',
      customerName: 'Geeta Sharma',
      phone: '+91 98765 43213',
      village: 'Ward 1',
      location: 'Near Main Road, Main Distribution Area, Ward 1',
      distance: '1.5 km',
      description: 'Water leaking from underground pipeline. Road is getting flooded.',
      submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      assignedTo: 'Technician B',
      eta: '15 min',
      urgency: 'High',
      icon: Wrench
    },
    {
      id: 'REQ-1005',
      type: 'Meter Problem',
      priority: 'low',
      status: 'resolved',
      customerName: 'Amit Patel',
      phone: '+91 98765 43214',
      village: 'Ward 4',
      location: 'House 89, Booster Line Area, Ward 4',
      distance: '6.2 km',
      description: 'Water meter not showing correct reading. Stuck at same value.',
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      resolvedBy: 'Technician C',
      resolutionTime: '12 hours',
      rating: 5,
      urgency: 'Low',
      icon: FileText
    },
    {
      id: 'REQ-1006',
      type: 'Other Issue',
      priority: 'medium',
      status: 'pending',
      customerName: 'Priya Verma',
      phone: '+91 98765 43215',
      village: 'Ward 2',
      location: 'House 56, Near Temple, Ward 2',
      distance: '5.1 km',
      description: 'Strange noise coming from water pipeline connection. Need inspection.',
      submittedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      urgency: 'Medium',
      icon: AlertCircle
    },
    {
      id: 'REQ-1007',
      type: 'No Water Supply',
      priority: 'high',
      status: 'pending',
      customerName: 'Ramesh Yadav',
      phone: '+91 98765 43216',
      village: 'Ward 5',
      location: 'House 23, Emergency Line Area, Ward 5',
      distance: '5.8 km',
      description: 'Complete water supply failure. No water for 6 hours.',
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      urgency: 'High',
      icon: Droplet
    },
    {
      id: 'REQ-1008',
      type: 'Low Water Pressure',
      priority: 'medium',
      status: 'resolved',
      customerName: 'Kavita Deshmukh',
      phone: '+91 98765 43217',
      village: 'Ward 3',
      location: 'House 34, East Side, Ward 3',
      distance: '7.5 km',
      description: 'Water pressure very low during evening hours.',
      submittedAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
      resolvedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      resolvedBy: 'Technician A',
      resolutionTime: '10 hours',
      rating: 4,
      urgency: 'Medium',
      icon: Gauge
    },
    {
      id: 'REQ-1009',
      type: 'Pipeline Leakage',
      priority: 'high',
      status: 'in-progress',
      customerName: 'Suresh Chavan',
      phone: '+91 98765 43218',
      village: 'Ward 4',
      location: 'Main Road Junction, Ward 4',
      distance: '7.2 km',
      description: 'Major pipeline burst near main junction. Water wastage ongoing.',
      submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      assignedTo: 'Technician D',
      eta: '45 min',
      urgency: 'High',
      icon: Wrench
    }
  ];

  // Get unique villages
  const villages = ['all', ...new Set(serviceRequests.map(req => req.village))].sort((a, b) => {
    if (a === 'all') return -1;
    if (b === 'all') return 1;
    return a.localeCompare(b);
  });

  // Filter requests based on active filter, village, and search query
  const filteredRequests = serviceRequests.filter(req => {
    const statusMatch = activeFilter === 'all' || req.status === activeFilter;
    const villageMatch = activeVillage === 'all' || req.village === activeVillage;
    
    // Search functionality - use effectiveSearchQuery
    const searchMatch = effectiveSearchQuery === '' || 
      req.id.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      req.type.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      req.customerName.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      req.village.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(effectiveSearchQuery.toLowerCase());
    
    return statusMatch && villageMatch && searchMatch;
  });

  // Stats calculation (based on current village filter)
  const villageRequests = activeVillage === 'all' 
    ? serviceRequests 
    : serviceRequests.filter(r => r.village === activeVillage);

  const stats = {
    total: villageRequests.length,
    pending: villageRequests.filter(r => r.status === 'pending').length,
    inProgress: villageRequests.filter(r => r.status === 'in-progress').length,
    resolved: villageRequests.filter(r => r.status === 'resolved').length,
    avgResponseTime: '45 min',
    satisfaction: '4.8/5'
  };

  // Village-wise distribution
  const villageStats = villages.slice(1).map(village => {
    const requests = serviceRequests.filter(r => r.village === village);
    return {
      village,
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      inProgress: requests.filter(r => r.status === 'in-progress').length,
      resolved: requests.filter(r => r.status === 'resolved').length,
    };
  });

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-gray-700 bg-gray-100';
      case 'in-progress': return 'text-blue-700 bg-blue-100';
      case 'resolved': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const handleAcceptRequest = (requestId) => {
    alert(`Request ${requestId} accepted and assigned to you!`);
  };

  const handleCallCustomer = (phone) => {
    alert(`Calling ${phone}...`);
  };

  const handleNavigate = (location) => {
    alert(`Opening navigation to: ${location}`);
  };

  const handleMarkComplete = (requestId) => {
    alert(`Marking request ${requestId} as complete...`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-black">Service Requests & Complaints</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage water service complaints and requests from all wards
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by ID, name, location, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Village Distribution Cards */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-5">
        <h3 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
          <MapPin size={20} className="text-blue-600" />
          Ward-wise Distribution (5 Pipeline Areas)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {villageStats.map((stat) => (
            <div
              key={stat.village}
              onClick={() => setActiveVillage(stat.village)}
              className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                activeVillage === stat.village ? 'border-blue-500 shadow-md' : 'border-gray-200'
              }`}
            >
              <h4 className="font-bold text-black mb-2">{stat.village}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-black">{stat.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-600">Pending:</span>
                  <span className="font-bold text-amber-600">{stat.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">In Progress:</span>
                  <span className="font-bold text-blue-600">{stat.inProgress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Resolved:</span>
                  <span className="font-bold text-green-600">{stat.resolved}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {activeVillage !== 'all' && (
          <button
            onClick={() => setActiveVillage('all')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Show All Wards
          </button>
        )}
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-black">{stats.total}</div>
          <div className="text-xs text-gray-600 mt-1">
            {activeVillage === 'all' ? 'Total Requests' : `${activeVillage}`}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-xs text-gray-600 mt-1">Pending</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-xs text-gray-600 mt-1">In Progress</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-xs text-gray-600 mt-1">Resolved</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.avgResponseTime}</div>
          <div className="text-xs text-gray-600 mt-1">Avg Response</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{stats.satisfaction}</div>
          <div className="text-xs text-gray-600 mt-1">Satisfaction</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeFilter === 'pending'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setActiveFilter('in-progress')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeFilter === 'in-progress'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          In Progress ({stats.inProgress})
        </button>
        <button
          onClick={() => setActiveFilter('resolved')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeFilter === 'resolved'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Resolved ({stats.resolved})
        </button>
      </div>

      {/* Service Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <CheckCircle size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-500">No {activeFilter} requests</h3>
            <p className="text-sm text-gray-400">All service requests are managed!</p>
          </div>
        ) : (
          filteredRequests.map((request) => {
            const Icon = request.icon;
            return (
              <div
                key={request.id}
                className={`bg-white rounded-lg border-2 p-5 transition-all hover:shadow-md ${
                  request.priority === 'high' ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-3 rounded-lg ${getPriorityColor(request.priority)}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-black">{request.type}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                          {request.urgency}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(request.status)}`}>
                          {request.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium text-black">{request.id}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatTimeAgo(request.submittedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {request.distance}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <span className="text-sm">
                        <span className="font-medium text-gray-700">Customer:</span>{' '}
                        <span className="text-black">{request.customerName}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span className="text-sm">
                        <span className="font-medium text-gray-700">Phone:</span>{' '}
                        <span className="text-black">{request.phone}</span>
                      </span>
                    </div>
                    <div className="flex items-start gap-2 md:col-span-2">
                      <MapPin size={16} className="text-gray-500 mt-0.5" />
                      <span className="text-sm">
                        <span className="font-medium text-gray-700">Ward:</span>{' '}
                        <span className="font-bold text-blue-600">{request.village}</span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-black">{request.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-black">Description:</span> {request.description}
                  </p>
                </div>

                {/* Status-specific info and actions */}
                {request.status === 'pending' && userRole === 'technician' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Accept Request
                    </button>
                  </div>
                )}

                {request.status === 'in-progress' && (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User size={16} className="text-blue-600" />
                        <span className="font-medium text-gray-700">Assigned to:</span>
                        <span className="text-black">{request.assignedTo}</span>
                        {request.eta && (
                          <>
                            <span className="text-gray-400">•</span>
                            <Clock size={16} className="text-blue-600" />
                            <span className="text-black">ETA: {request.eta}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {userRole === 'technician' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCallCustomer(request.phone)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Phone size={18} />
                          Call Customer
                        </button>
                        <button
                          onClick={() => handleNavigate(request.location)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <MapPin size={18} />
                          Navigate
                        </button>
                        <button
                          onClick={() => handleMarkComplete(request.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {request.status === 'resolved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-2 text-green-700">
                          <CheckCircle size={16} />
                          <span className="font-medium">Resolved by {request.resolvedBy}</span>
                        </span>
                        <span className="text-gray-600">
                          Resolution time: {request.resolutionTime}
                        </span>
                      </div>
                      {request.rating && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: request.rating }).map((_, i) => (
                            <span key={i} className="text-yellow-500">★</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Emergency Contact Footer */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-5">
        <div className="flex items-center gap-3">
          <AlertCircle size={32} className="text-red-600" />
          <div>
            <h3 className="font-bold text-lg text-black">Emergency Helpline</h3>
            <p className="text-sm text-gray-700">
              For critical emergencies (burst pipes, contamination, infrastructure failure)
            </p>
            <p className="text-lg font-bold text-red-600 mt-1">📞 1800-XXX-XXXX (24/7)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
