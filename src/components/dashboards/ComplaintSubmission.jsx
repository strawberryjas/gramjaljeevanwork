import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, AlertCircle, CheckCircle, MapPin, Phone, User, FileText } from 'lucide-react';

/**
 * ComplaintSubmission Component
 * - Public-facing complaint/service request submission form
 * - Allows guest users to report water supply issues
 * - Tracks submission status and provides confirmation
 */
export const ComplaintSubmission = ({ offlineMode, lastSync }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    ward: '',
    issueType: '',
    description: '',
    location: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [requestId, setRequestId] = useState(null);

  const issueTypes = [
    { value: 'water-supply', label: 'No Water Supply', icon: '💧' },
    { value: 'low-pressure', label: 'Low Water Pressure', icon: '📉' },
    { value: 'contamination', label: 'Water Contamination', icon: '⚠️' },
    { value: 'leakage', label: 'Pipeline Leakage', icon: '🚰' },
    { value: 'quality', label: 'Water Quality Issue', icon: '🧪' },
    { value: 'other', label: 'Other Issue', icon: '📝' },
  ];

  const villages = [
    'Village A',
    'Village B',
    'Village C',
    'Village D',
    'Village E',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (formData.phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.village) {
      setError('Please select your village');
      return false;
    }
    if (!formData.issueType) {
      setError('Please select the issue type');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please describe your complaint');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate request ID
      const newRequestId = `REQ-${Date.now().toString().slice(-6)}`;
      setRequestId(newRequestId);
      
      // In real implementation, this would call the service request API
      // await serviceRequestService.submitComplaint(formData);
      
      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setRequestId(null);
        setFormData({
          name: '',
          phone: '',
          village: '',
          ward: '',
          issueType: '',
          description: '',
          location: '',
        });
      }, 5000);
      
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
      console.error('Complaint submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Complaint Submitted Successfully!
            </h2>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-gray-600 mb-2">Your Request ID</p>
              <p className="text-2xl font-bold text-blue-600">{requestId}</p>
              <p className="text-sm text-gray-500 mt-2">
                Please save this ID for future reference
              </p>
            </div>
            
            <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Complaint Details:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Village:</strong> {formData.village}</p>
                {formData.ward && <p><strong>Ward:</strong> {formData.ward}</p>}
                <p><strong>Issue Type:</strong> {issueTypes.find(t => t.value === formData.issueType)?.label}</p>
                <p><strong>Description:</strong> {formData.description}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Our technician will contact you shortly to resolve your complaint.
              You will receive updates via phone.
            </p>
            
            <button
              onClick={() => {
                setSubmitted(false);
                setRequestId(null);
                setFormData({
                  name: '',
                  phone: '',
                  village: '',
                  ward: '',
                  issueType: '',
                  description: '',
                  location: '',
                });
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Submit Another Complaint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 md:p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Submit a Complaint
            </h1>
            <p className="text-blue-100">
              Report water supply issues in your area. Our team will address your concerns promptly.
            </p>
          </div>

          {/* Offline Warning */}
          {offlineMode && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold">You are offline</p>
                  <p>Your complaint will be submitted when connection is restored.</p>
                  {lastSync && (
                    <p className="text-xs mt-1">Last synced: {new Date(lastSync).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  Village/Area *
                </label>
                <select
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select your village</option>
                  {villages.map(village => (
                    <option key={village} value={village}>{village}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  Ward Number (Optional)
                </label>
                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleInputChange}
                  placeholder="e.g., Ward 3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Issue Type */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                Type of Issue *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {issueTypes.map(type => (
                  <label
                    key={type.value}
                    className={`
                      flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${formData.issueType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="issueType"
                      value={type.value}
                      checked={formData.issueType === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-2">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                Complaint Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please describe the issue in detail..."
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Location Details */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                Specific Location (Optional)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Near Primary School, Main Road"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`
                  flex items-center px-8 py-3 rounded-lg font-semibold text-white transition-all
                  ${submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                  }
                `}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Complaint
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold text-gray-800 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">1.</span>
              Your complaint will be registered and assigned a unique Request ID
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">2.</span>
              Our technician will be notified and will contact you within 24 hours
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">3.</span>
              You will receive updates about the resolution progress via phone
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
