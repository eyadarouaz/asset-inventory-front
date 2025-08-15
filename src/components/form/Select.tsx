import React, { useState } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string | number) => void;
  className?: string;
  defaultValue?: string;
  value?: string | number;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value,
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;

    // If numeric string, cast to number if the option was a number
    const parsed = options.find((o) => o.value.toString() === val)?.value ?? val;
    onChange(parsed);
  };

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${value ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"
        } ${className}`}
      value={value !== undefined ? value.toString() : defaultValue?.toString() || ""}
      onChange={handleChange}
    >
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>

      {options.map((option, idx) => (
        <option
          key={`${option.value}-${idx}`}  // <-- use value + index to guarantee uniqueness
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
