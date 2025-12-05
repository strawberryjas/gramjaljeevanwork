import React from 'react';
import {
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Wrench,
  TrendingUp,
} from 'lucide-react';

const MaintenanceCard = ({
  title,
  lastMaintenanceDate,
  nextMaintenanceDate,
  maintenanceIntervalDays,
  maintenanceHistory = [],
  additionalMetrics = [],
  type = 'general', // general, pump, tank, pipeline, sensor
}) => {
  // Calculate days until next maintenance
  const now = Date.now();
  const daysUntil = Math.ceil((nextMaintenanceDate - now) / (24 * 60 * 60 * 1000));
  const daysSince = Math.ceil((now - lastMaintenanceDate) / (24 * 60 * 60 * 1000));

  // Determine status based on days until maintenance
  const getMaintenanceStatus = () => {
    if (daysUntil < 0)
      return {
        status: 'OVERDUE',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-500',
      };
    if (daysUntil <= 7)
      return {
        status: 'URGENT',
        color: 'orange',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-500',
      };
    if (daysUntil <= 14)
      return {
        status: 'DUE SOON',
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
      };
    return {
      status: 'SCHEDULED',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
    };
  };

  const statusInfo = getMaintenanceStatus();

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Get icon based on type
  const getTypeIcon = () => {
    switch (type) {
      case 'pump':
        return <TrendingUp className="w-5 h-5" />;
      case 'tank':
        return <CheckCircle className="w-5 h-5" />;
      case 'pipeline':
        return <Wrench className="w-5 h-5" />;
      case 'sensor':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-b-4 px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-${statusInfo.color}-600`}>{getTypeIcon()}</div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          </div>
          <div
            className={`px-4 py-1.5 rounded-full bg-${statusInfo.color}-100 border border-${statusInfo.color}-300`}
          >
            <span className={`text-sm font-bold text-${statusInfo.color}-700`}>
              {statusInfo.status}
            </span>
          </div>
        </div>
      </div>

      {/* Countdown and Dates */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Last Maintenance */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Last Maintenance</p>
              <p className="text-sm font-bold text-gray-800">{formatDate(lastMaintenanceDate)}</p>
              <p className="text-xs text-gray-500 mt-0.5">{daysSince} days ago</p>
            </div>
          </div>

          {/* Next Maintenance */}
          <div className="flex items-start gap-3">
            <div className={`p-2 bg-${statusInfo.color}-100 rounded-lg`}>
              <Calendar className={`w-5 h-5 text-${statusInfo.color}-600`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Next Maintenance</p>
              <p className="text-sm font-bold text-gray-800">{formatDate(nextMaintenanceDate)}</p>
              <p className={`text-xs text-${statusInfo.color}-600 font-semibold mt-0.5`}>
                {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `in ${daysUntil} days`}
              </p>
            </div>
          </div>

          {/* Interval */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Interval</p>
              <p className="text-sm font-bold text-gray-800">
                Every {maintenanceIntervalDays} days
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Regular schedule</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-600">Maintenance Cycle Progress</span>
            <span className="text-xs font-bold text-gray-700">
              {Math.round((daysSince / maintenanceIntervalDays) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                statusInfo.color === 'red'
                  ? 'from-red-500 to-red-600'
                  : statusInfo.color === 'orange'
                    ? 'from-orange-500 to-orange-600'
                    : statusInfo.color === 'yellow'
                      ? 'from-yellow-500 to-yellow-600'
                      : 'from-green-500 to-green-600'
              }`}
              style={{ width: `${Math.min((daysSince / maintenanceIntervalDays) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      {additionalMetrics.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Component Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {additionalMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                <p className="text-sm font-bold text-gray-800">{metric.value}</p>
                {metric.subtext && <p className="text-xs text-gray-400 mt-0.5">{metric.subtext}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance History */}
      {maintenanceHistory.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-600" />
            Maintenance History
          </h4>
          <div className="space-y-3">
            {maintenanceHistory.slice(0, 3).map((entry, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-bold text-gray-800">{entry.type}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDate(entry.date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{entry.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{entry.technician}</span>
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-gray-500 mt-1 italic">{entry.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {maintenanceHistory.length > 3 && (
            <button className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              View all {maintenanceHistory.length} records →
            </button>
          )}
        </div>
      )}

      {/* Action Recommendations */}
      {daysUntil <= 14 && (
        <div
          className={`px-6 py-4 bg-${statusInfo.color}-50 border-t-2 border-${statusInfo.color}-200`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={`w-5 h-5 text-${statusInfo.color}-600 flex-shrink-0 mt-0.5`}
            />
            <div>
              <h4 className={`text-sm font-bold text-${statusInfo.color}-800 mb-1`}>
                Action Required
              </h4>
              <p className="text-xs text-gray-700">
                {daysUntil < 0
                  ? `Maintenance is overdue by ${Math.abs(daysUntil)} days. Schedule immediate service.`
                  : daysUntil <= 7
                    ? `Maintenance due in ${daysUntil} days. Contact technician immediately.`
                    : `Maintenance due soon. Schedule service within next ${daysUntil} days.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceCard;
