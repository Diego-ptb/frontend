import React from 'react';
import { getAvatarUrl } from '../../utils/avatar';

interface AvatarImageProps {
    src?: string;
    username?: string;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    ring?: boolean;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
    src,
    username,
    alt,
    size = 'md',
    className = '',
    ring = true
}) => {
    const sizeClasses = {
        xs: 'w-6',
        sm: 'w-8',
        md: 'w-12',
        lg: 'w-16',
        xl: 'w-24'
    };

    const [imageLoading, setImageLoading] = React.useState(true);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
    };

    const imageSrc = src ? getAvatarUrl(src, username) : getAvatarUrl('', username || 'User');

    return (
        <div className={`avatar ${className}`}>
            <div className={`${sizeClasses[size]} rounded-full ${ring ? 'ring ring-primary ring-offset-base-100 ring-offset-2' : ''}`}>
                {imageLoading && (
                    <div className="flex items-center justify-center w-full h-full bg-base-300 rounded-full">
                        <span className={`loading loading-spinner loading-xs text-primary`}></span>
                    </div>
                )}
                <img
                    src={imageSrc}
                    alt={alt || username || 'User'}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className={imageLoading ? 'hidden' : ''}
                />
            </div>
        </div>
    );
};