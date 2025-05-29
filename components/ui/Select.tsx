import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  labelSrOnly?: boolean; // For accessibility if label is visually hidden
}

const Select: React.FC<SelectProps> = ({ label, options, id, labelSrOnly = false, ...rest }) => {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-slate-700 mb-1 ${labelSrOnly ? 'sr-only' : ''}`}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className="block w-full pl-3 pr-10 py-2.5 text-base text-slate-900 border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md shadow-sm appearance-none"
        {...rest}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;