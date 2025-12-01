import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Title from './Title';


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70 p-4 backdrop-blur-lg animate-fade-in">
            <div
                ref={modalRef}
                className={`relative w-full max-h-full rounded-2xl bg-base-100 border border-primary/20 shadow-lg animate-scale-in ${size === 'sm' ? 'max-w-md' :
                        size === 'lg' ? 'max-w-6xl' :
                            size === 'xl' ? 'max-w-7xl' :
                                'max-w-4xl'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between rounded-t-2xl border-b border-base-300 p-6 bg-base-200/50">
                    {title && <Title level={3} className="text-gradient-primary">{title}</Title>}
                    <button
                        onClick={onClose}
                        className="ml-auto inline-flex items-center justify-center rounded-lg p-2 text-base-content/60 hover:bg-base-200 hover:text-primary transition-all duration-200"
                    >
                        <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[75vh]">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
