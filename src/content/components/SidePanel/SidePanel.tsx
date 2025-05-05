import React, { PropsWithChildren } from 'react';

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SidePanel: React.FC<PropsWithChildren<SidePanelProps>> = ({ isOpen, onClose, children }) => {
    // TODO: Replace inline styles with CSS Modules
    // TODO: Apply styles based on data-view attribute from parent
    return (
        <div
            // Apply base styles to the outer container
            className="fixed top-0 right-0 z-[9999] w-1/3 h-screen text-gray-900 bg-white shadow-lg transition-transform duration-300 ease-in-out"
            style={{
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                // overflowY: 'auto', // <-- Remove overflow from outer div
                // boxSizing: 'border-box' // Usually handled by Tailwind defaults/reset
            }}
            aria-hidden={!isOpen} // Accessibility
        >
            {/* Make the inner container take full height */}
            <div className="h-full">
                 {children}
            </div>
        </div>
    );
};

export default SidePanel; 