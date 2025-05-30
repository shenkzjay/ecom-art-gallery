// Dropdown.tsx
import { ProfileIcon } from "public/icons/profile";
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
        className="inline-flex justify-center items-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-blue-50 rounded-full hover:bg-blue-200 cursor-pointer"
      >
        <span className="block w-5 h-5 text-blue-600">
          <ProfileIcon />
        </span>
        <p className="capitalize bg-blue-400 rounded-full text-white w-6 flex items-center justify-center h-6">
          {label.slice(0, 1)}
        </p>
      </button>

      {isOpen && (
        <div
          className="[transform:translateX(70%)] md:[transform:translateX(0)] absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
