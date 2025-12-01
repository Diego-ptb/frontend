import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AvatarImage } from './AvatarImage';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
    user?: {
        username?: string;
        image?: string;
        balance?: number;
    };
    userId?: string;
}

const Header: React.FC<HeaderProps> = ({ user, userId }) => {
    const location = useLocation();
    const { t } = useLanguage();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className="sticky top-0 z-40 bg-base-100/95 border-b border-base-300/20 backdrop-blur-xl">
            <div className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="group">
                            <span className="text-3xl font-black gradient-text hover:scale-105 transition-transform duration-300">
                                SkinTrades
                            </span>
                        </Link>

                        {/* Nav Links */}
                        <div className="hidden sm:ml-12 sm:flex sm:space-x-2">
                            <Link
                                to="/"
                                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${isActive('/')
                                    ? 'text-primary bg-primary/10'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-dark-elevated'
                                    }`}
                            >
                                {t.header.home}
                                {isActive('/') && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-primary rounded-full"></span>
                                )}
                            </Link>
                            <Link
                                to="/marketplace"
                                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${isActive('/marketplace')
                                    ? 'text-primary bg-primary/10'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-dark-elevated'
                                    }`}
                            >
                                {t.header.marketplace}
                                {isActive('/marketplace') && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-primary rounded-full"></span>
                                )}
                            </Link>
                            {userId && (
                                <>
                                    <Link
                                        to="/inventory"
                                        className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${isActive('/inventory')
                                            ? 'text-primary bg-primary/10'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-dark-elevated'
                                            }`}
                                    >
                                        {t.header.inventory}
                                        {isActive('/inventory') && (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-primary rounded-full"></span>
                                        )}
                                    </Link>
                                    <Link
                                        to="/friendships"
                                        className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${isActive('/friendships')
                                            ? 'text-primary bg-primary/10'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-dark-elevated'
                                            }`}
                                    >
                                        {t.header.friends}
                                        {isActive('/friendships') && (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-primary rounded-full"></span>
                                        )}
                                    </Link>
                                    <Link
                                        to="/trades"
                                        className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${isActive('/trades')
                                            ? 'text-primary bg-primary/10'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-dark-elevated'
                                            }`}
                                    >
                                        {t.header.trades}
                                        {isActive('/trades') && (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-primary rounded-full"></span>
                                        )}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Auth Button */}
                    <div className="flex items-center gap-4">
                        {userId ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="btn btn-ghost btn-circle">
                                    <AvatarImage
                                        src={user?.image}
                                        username={user?.username}
                                        alt={user?.username || 'User'}
                                        size="sm"
                                        ring={true}
                                    />
                                </Link>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="font-bold">{user?.username}</span>
                                    <span className="text-sm text-text-muted">${user?.balance?.toFixed(2) || '0.00'}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        window.dispatchEvent(new Event('auth-change'));
                                        window.location.href = '/';
                                    }}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold glass border border-text-muted/20 text-text-secondary hover:text-text-primary hover:border-primary/50 hover:shadow-glow-primary transition-all duration-300"
                                >
                                    {t.auth.logout}
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/auth"
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-primary text-white hover:shadow-glow-purple hover:scale-105 active:scale-95 transition-all duration-300 shine"
                            >
                                {t.auth.signIn}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;