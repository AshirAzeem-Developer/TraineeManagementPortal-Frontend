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
      <label className="mb-2.5 block text-black dark:text-white">
        {label}
        {required && <span className="text-meta-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
    </div>
  );
};

export default InputGroup;
