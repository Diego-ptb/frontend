import React from 'react';
import { type UserProfileDto } from '../../api/generated/model';
import { AvatarImage } from './AvatarImage';

interface AvatarItemProps {
    user: UserProfileDto;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
}

export const AvatarItem: React.FC<AvatarItemProps> = ({
    user,
    size = 'md',
    onClick,
    className = ''
}) => {
    const sizeMap = {
        sm: 'sm' as const,
        md: 'md' as const,
        lg: 'lg' as const
    };

    return (
        <div
            className={`${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${className}`}
            onClick={onClick}
        >
            <AvatarImage
                src={user.image}
                username={user.username}
                alt={user.username}
                size={sizeMap[size]}
                ring={true}
            />
        </div>
    );
};