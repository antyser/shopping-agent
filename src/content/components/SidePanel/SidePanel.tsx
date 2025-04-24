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
            className="text-gray-900 bg-white"
            style={{
                position: 'fixed', top: 0, right: 0, width: '33%', height: '100vh',
                // background: '#1F2937', // Removed
                // color: 'white', // Removed
                zIndex: 9999,
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
                overflowY: 'auto',
                boxSizing: 'border-box'
            }}
            aria-hidden={!isOpen} // Accessibility
        >
            <div>
                 {children}
            </div>
        </div>
    );
};

export default SidePanel; 