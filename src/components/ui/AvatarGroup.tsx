import React from 'react';
import { AvatarItem } from './AvatarItem';
import { type UserProfileDto } from '../../api/generated/model';

interface AvatarGroupProps {
    users: UserProfileDto[];
    maxDisplay?: number;
    size?: 'sm' | 'md' | 'lg';
    onUserClick?: (user: UserProfileDto) => void;
    onMoreClick?: () => void;
    className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    users,
    maxDisplay = 8,
    size = 'md',
    onUserClick,
    onMoreClick,
    className = ''
}) => {
    const displayedUsers = users.slice(0, maxDisplay);
    const remainingCount = users.length - maxDisplay;

    return (
        <div className={`flex gap-2 overflow-x-auto pb-2 ${className}`}>
            {displayedUsers.map((user) => (
                <AvatarItem
                    key={user.id}
                    user={user}
                    size={size}
                    onClick={onUserClick ? () => onUserClick(user) : undefined}
                />
            ))}
            {remainingCount > 0 && onMoreClick && (
                <div className="avatar placeholder cursor-pointer" onClick={onMoreClick}>
                    <div className={`bg-neutral text-neutral-content rounded-full ${size === 'sm' ? 'w-8' : size === 'lg' ? 'w-16' : 'w-12'}`}>
                        <span>+{remainingCount}</span>
                    </div>
                </div>
            )}
        </div>
    );
};