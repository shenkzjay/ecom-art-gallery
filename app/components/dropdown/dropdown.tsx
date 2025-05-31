// Dropdown.tsx
import { ProfileIcon } from "public/icons/profile";
import { UpArrowheadIcon } from "public/icons/up-arrowhead";
import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  label: string;
  children: React.ReactNode;
}

const Dropdown = ({ label, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center gap-2 w-full px-2 py-1 text-sm font-medium text-white bg-blue-50 rounded-full hover:bg-blue-200 cursor-pointer"
      >
        <p className="capitalize bg-blue-400 rounded-full text-white w-6 flex items-center justify-center h-6">
          {label.slice(0, 1)}
        </p>
        <span className="block w-5 h-5 text-blue-600 [transform:scale(1,-1)]">
          <UpArrowheadIcon />
        </span>
      </button>

      {isOpen && (
        <div
          className="[transform:translateX(70%)] md:[transform:translateX(0)] absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md drop-shadow-[8px_10px_18px_rgba(0,0,0,0.08)]  focus:outline-none"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="pb-2" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
