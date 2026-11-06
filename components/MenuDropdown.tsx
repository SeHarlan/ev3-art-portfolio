import clsx from "clsx";
import { FC, useEffect, useRef, useState } from "react";

interface MenuDropdownProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  options: {
    label: string;
    onClick: () => void;
  }[];
  className?: string;
}

const MenuDropdown: FC<MenuDropdownProps> = ({
  options,
  isOpen,
  setIsOpen,
  className
}) => {

   const ref = useRef<HTMLDivElement>(null);

   useEffect(() => {
     // Function to handle clicks outside the component
     const handleClickOutside = (event: any) => {
       if (ref.current && !ref.current.contains(event.target)) {
         setIsOpen(false);
       }
     };

     document.addEventListener("mousedown", handleClickOutside);
     document.addEventListener("touchstart", handleClickOutside);

     return () => {
       document.removeEventListener("mousedown", handleClickOutside);
       document.removeEventListener("touchstart", handleClickOutside);
     };
   }, []);
  
  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={clsx(
        isOpen ? "flex flex-col items-start " : "hidden",
        "p95-chrome bg-windowsGray text-windowsText classic-border p-2 shadow-md cursor-default z-30",
        "w-fit pointer-events-auto",
        className
      )}
    >
      <div className="flex flex-col ">
        {options.map((option, i) => (
          <button
            key={option.label}
            onClick={() => {
              option.onClick();
              setIsOpen(false);
            }}
            className="w-full p-1 hover:bg-windowsSelect hover:text-windowsSelectText focus-visible:bg-windowsSelect focus-visible:text-windowsSelectText focus-visible:outline-none"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuDropdown;
