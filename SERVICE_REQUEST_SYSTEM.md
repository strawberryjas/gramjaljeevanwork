# Service Request System Documentation

## Overview
A separate **Service Request Dashboard** has been created that works like NoBrokerHood/UrbanClap for water service management. This is now a **separate tab** in the application, keeping the original overview dashboards intact.

---

## System Architecture

### **1. Separate Dashboards**

#### **Overview Dashboard** (Original - Unchanged)
- **Guest**: Gamified dashboard with water scores, achievements, performance charts
- **Technician**: Full operational dashboard with sensors, metrics, and controls
- **Researcher**: Analytics and data export dashboard

#### **Service Requests Dashboard** (New - Separate Tab)
- **Guest**: Report water issues and track service requests
- **Technician**: Manage incoming service requests, accept, and resolve issues
- **All Users**: Access via "Service Requests" button in sidebar

---

## Navigation

### **Sidebar Structure**
```
📊 Overview (Role-based dashboard)
📋 Service Requests (New - For all users)
🏗️ Infrastructure (Technician/Researcher only)
📅 Daily Operations (Technician/Researcher only)
⚡ Energy (All users)
... other tabs
```

---

## Service Request Dashboard Features

### **For Guests (Public Users)**

#### **1. Report Issue Section**
- **6 Quick Issue Types:**
  - 🔴 No Water Supply (Urgent)
  - 🟠 Low Water Pressure
  - 🔴 Dirty/Contaminated Water (Urgent)
  - 🟠 Pipeline Leakage (Urgent)
  - 🔵 Meter Problem
  - ⚪ Other Issue

- **One-Click Reporting**: Click issue type → Opens form
- **Detailed Form:**
  - Issue type dropdown
  - Description textarea
  - Location input
  - Contact number
  - Urgency level selector (Low/Medium/High)

#### **2. My Service Requests**
Shows all user's requests with:
- Request ID (REQ-XXXX)
- Issue type and description
- Status badges (Pending/In Progress/Resolved)
- Assigned technician
- Date/time submitted
- ETA (if in progress)
- Resolution time (if resolved)
- Rating (if resolved)

**Guest Actions:**
- 📞 Call Technician (if in progress)
- 🕐 Track Status
- ⭐ Rate Service (after resolution)

---

### **For Technicians**

#### **1. Active Service Requests**
Shows all incoming requests with:
- Request ID and urgency badge
- Customer name and phone
- Issue type and description
- Location with distance
- Time since request
- Current status

**Technician Actions:**

**Pending Requests:**
- ✅ Accept Request

**In Progress:**
- 📞 Call Customer
- 🗺️ Navigate to Location
- ✅ Mark Complete

#### **2. Request Management**
- **Priority Sorting**: Urgent requests highlighted in red
- **Distance Display**: Shows distance to customer location
- **Real-time Updates**: Status changes reflected immediately
- **Customer Info**: Full contact details and location

---

## User Flow

### **Guest Journey:**
1. Login as Guest
2. Click "Service Requests" in sidebar
3. See system status and quick issue types
4. Click issue type (e.g., "No Water Supply")
5. Fill form (description, location, phone)
6. Submit request
7. Get confirmation
8. Track status in "My Requests"
9. Call technician if needed
10. Rate service after completion

### **Technician Journey:**
1. Login as Technician
2. Click "Service Requests" in sidebar
3. See pending requests (with NEW badge)
4. Click "Accept Request"
5. Customer gets notified
6. Call customer to confirm
7. Navigate to location
8. Fix the issue
9. Mark as complete
10. Customer rates service

---

## File Structure

```
src/
├── components/
│   └── dashboards/
│       ├── GuestDashboard.jsx (Original - Gamified overview)
│       ├── TechnicianDashboard.jsx (Original - Operational overview)
│       ├── ResearcherDashboard.jsx (Original - Analytics overview)
│       ├── ServiceRequestDashboard.jsx (NEW - Service management)
│       └── index.js (Exports all dashboards)
├── App.jsx (Updated with service-requests tab)
└── ...
```

---

## Key Features

### **System Status Header**
Displays for all users:
- Water Quality: Excellent
- Supply Status: Normal
- Avg Response Time: 45 min
- Customer Satisfaction: 4.8/5

### **Emergency Contact**
24/7 helpline for urgent emergencies:
- Burst pipes
- Water contamination
- Critical infrastructure failures

### **Request Tracking**
- Real-time status updates
- ETA display for in-progress requests
- Resolution time tracking
- Customer rating system

---

## Design Principles

### **Color Coding**
- 🔴 **Red**: Urgent/High priority issues
- 🟠 **Amber**: Medium priority issues
- 🔵 **Blue**: Normal/Low priority issues
- 🟢 **Green**: Resolved/Completed

### **Status Badges**
- **Pending**: Gray badge
- **In Progress**: Blue badge
- **Resolved**: Green badge

### **Responsive Design**
- Mobile-friendly interface
- Touch-optimized buttons
- Collapsible sections
- Swipeable cards

---

## Benefits

### **For Guests:**
✅ Easy issue reporting
✅ Real-time tracking
✅ Direct communication with technicians
✅ Transparent service status
✅ Rating and feedback system

### **For Technicians:**
✅ Centralized request management
✅ Priority-based workflow
✅ Customer contact info
✅ Navigation integration
✅ Performance tracking

### **For System:**
✅ Improved response times
✅ Better customer satisfaction
✅ Accountability and transparency
✅ Data-driven insights
✅ Efficient resource allocation

---

## Technical Implementation

### **Components:**
- `ServiceRequestDashboard.jsx`: Main service request interface
- Shared between guests and technicians
- Role-based UI rendering
- Mock data for demonstration

### **Integration:**
- Added to `App.jsx` as separate tab
- Available for all user roles
- Sidebar button added after Overview
- Proper routing and state management

### **Styling:**
- Tailwind CSS with proper color classes
- No dynamic class generation (fixed Tailwind JIT issue)
- Consistent with government theme
- Professional and modern UI

---

## Future Enhancements

1. **Real-time Notifications**: Push notifications for status updates
2. **GPS Tracking**: Live technician location tracking
3. **Photo Upload**: Attach photos to service requests
4. **Payment Integration**: Online payment for services
5. **Chatbot**: AI-powered customer support
6. **Analytics Dashboard**: Service metrics and insights
7. **Multi-language Support**: Regional language support
8. **Offline Mode**: Work without internet connection

---

## Usage

### **Access Service Requests:**
1. Login to the system
2. Click "Service Requests" button in sidebar
3. View/manage requests based on your role

### **Report an Issue (Guest):**
1. Go to Service Requests tab
2. Click issue type or "Report an Issue"
3. Fill the form
4. Submit

### **Manage Requests (Technician):**
1. Go to Service Requests tab
2. View active requests
3. Accept pending requests
4. Call customer and navigate
5. Mark as complete

---

## Support

For technical support or feature requests, contact the development team.

**Emergency Helpline**: 1800-XXX-XXXX (24/7)

---

**Last Updated**: November 26, 2024
**Version**: 1.0.0
**Status**: ✅ Production Ready

