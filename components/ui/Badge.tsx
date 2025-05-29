
import React from 'react';
import { Severity, Status, IncidentType, UserType } from '../../types';

interface BadgeProps {
  text: string; // This should be the pre-resolved label from configuration
  type: 'status' | 'severity' | 'type' | 'userType'; // Added userType
  value: Status | Severity | IncidentType | UserType | string; // Allow string for flexibility if ID is passed
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ text, type, value, size = 'sm' }) => {
  let colorClasses = "";
  const pyClass = size === 'sm' ? 'py-0.5' : 'py-1';


  if (type === 'status') {
    switch (value as Status) {
      case Status.NEW:
        colorClasses = "bg-sky-100 text-sky-700"; 
        break;
      case Status.UNDER_INVESTIGATION:
        colorClasses = "bg-amber-100 text-amber-700"; 
        break;
      case Status.RESOLVED:
        colorClasses = "bg-emerald-100 text-emerald-700"; 
        break;
      case Status.FALSE_ALARM:
        colorClasses = "bg-slate-100 text-slate-600";
        break;
      default:
        colorClasses = "bg-slate-100 text-slate-700";
    }
  } else if (type === 'severity') {
    switch (value as Severity) {
      case Severity.LOW:
        colorClasses = "bg-emerald-100 text-emerald-700"; 
        break;
      case Severity.MEDIUM:
        colorClasses = "bg-yellow-100 text-yellow-700"; 
        break;
      case Severity.HIGH:
        colorClasses = "bg-orange-100 text-orange-700"; 
        break;
      case Severity.CRITICAL:
        colorClasses = "bg-red-100 text-red-700"; 
        break;
      default:
        colorClasses = "bg-slate-100 text-slate-700";
    }
  } else if (type === 'type') { // Incident Type
     colorClasses = "bg-indigo-100 text-indigo-700"; 
  } else if (type === 'userType') {
     colorClasses = "bg-purple-100 text-purple-700";
  }


  return (
    <span className={`inline-flex items-center px-2.5 ${pyClass} text-xs font-semibold rounded-full ${colorClasses}`}>
      {text}
    </span>
  );
};

export default Badge;