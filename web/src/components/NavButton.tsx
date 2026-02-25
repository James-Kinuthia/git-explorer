import React from "react";
export interface NavButtonProps {
    onClick: () => void;
    isActive: boolean;
    children?: React.ReactNode;
}

const NavButton = ({ onClick, isActive, children }: NavButtonProps) => {
    return (
        <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors 
                ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default NavButton;