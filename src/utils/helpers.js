// Helper Functions

export const getNextDistributionTime = () => {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour < 6) return "Today, 06:00 AM";
  if (hour >= 6 && hour < 9) return "Live Now (Ends 09:00 AM)";
  if (hour >= 9 && hour < 17) return "Today, 05:00 PM";
  if (hour >= 17 && hour < 19) return "Live Now (Ends 07:00 PM)";
  return "Tomorrow, 06:00 AM";
};

