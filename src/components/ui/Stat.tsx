import React, { type ReactNode } from 'react';

interface StatProps {
    title: string;
    value: string | number;
    desc?: string;
    figure?: ReactNode;
    className?: string;
}

const Stat: React.FC<StatProps> = ({ title, value, desc, figure, className = '' }) => {
    return (
        <div className={`stat bg-base-200/90 backdrop-blur-xl rounded-2xl hover-lift hover-glow transition-all duration-300 shadow-2xl hover:shadow-3xl p-6 ${className}`}>
            {figure && <div className="stat-figure text-primary text-5xl mb-4">{figure}</div>}
            <div className="stat-title text-base-content/80 font-semibold text-lg mb-2">{title}</div>
            <div className="stat-value text-gradient-primary text-4xl font-black mb-2">{value}</div>
            {desc && <div className="stat-desc text-base-content/60 text-sm">{desc}</div>}
        </div>
    );
};

export default Stat;
