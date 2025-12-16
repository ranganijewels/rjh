import React from "react";
import clsx from "clsx";

const RadioButton = ({
  label,
  name,
  value,
  checked,
  onChange,
  className = "",
  labelClassName = "",
  children,
  ...rest
}) => {
  return (
    <label
      className={clsx(
        "flex items-center justify-between w-full px-4 py-3 rounded cursor-pointer transition lg:text-[16px] text-[12px]",
        checked
          ? "bg-[var(--grey-00)] border-[var(--teal-1)]"
          : "bg-white border-transparent",
        labelClassName
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className={clsx("accent-[var(--teal-1)] w-4 h-4", className)}
          {...rest}
        />
        {children ? (
          children
        ) : (
          <span className="lg:text-[16px] text-[12px] font-[400] text-[var(--grey-2)]">{label}</span>
        )}
      </div>
    </label>
  );
};

export default RadioButton;
