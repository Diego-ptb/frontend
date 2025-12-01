import React, { type ReactNode } from 'react';
import Title from './Title';

interface HeroProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
    className?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, children, className = '' }) => {
    return (
        <div className={`hero min-h-screen bg-gradient-to-br from-base-100 to-base-200 ${className}`}>
            <div className="hero-content text-center">
                <div className="max-w-4xl">
                    <Title level={1} gradient className="mb-6 animate-fade-in">
                        {title}
                    </Title>
                    {subtitle && (
                        <p className="text-2xl text-base-content/80 mb-10 animate-slide-up">
                            {subtitle}
                        </p>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Hero;
