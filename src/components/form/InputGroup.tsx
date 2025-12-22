import React from "react";

interface InputGroupProps {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customClasses?: string;
  required?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  customClasses,
  required,
}) => {
  return (
    <div className={customClasses}>
      <label className="mb-2.5 block text-black dark:text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded border-[1.5px] border-gray-300 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#24a556] active:border-[#24a556] disabled:cursor-default disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-[#24a556]"
      />
    </div>
  );
};

export default InputGroup;
