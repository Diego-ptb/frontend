import React from 'react';
import { type ListingDto } from '../../../api/generated/model';
import Button from '../../../components/ui/Button';
import { unescapeItemName } from '../../../utils/string';
import { X } from 'lucide-react';

interface ListingCardProps {
    listing: ListingDto;
    onClick: () => void;
    onCancel?: (listingId: string) => void;
    isOwner?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, onCancel, isOwner = false }) => {
    return (
        <div
            className={`group relative overflow-visible rounded-2xl border border-base-300 dark:border-base-content/10 bg-base-100 dark:bg-base-200 shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl hover-lift transition-all duration-300 ${!isOwner ? 'cursor-pointer' : ''}`}
            onClick={!isOwner ? onClick : undefined}
        >
            {/* Image Container with Overlay Content */}
            <div className="relative h-40 w-full overflow-hidden rounded-2xl" style={{ backgroundColor: listing.rarityColor || '#ffffff' }}>
                <img
                    src={listing.itemImage || 'https://placehold.co/300x300'}
                    alt={unescapeItemName(listing.itemName || 'Item')}
                    className="h-full w-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                />

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-5 rounded-2xl"></div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-2xl"></div>

                {/* Item Name Overlay */}
                <div className="absolute top-0 left-0 right-0 bg-black/70 dark:bg-black/80 p-2 z-20" style={{ borderRadius: '1rem 1rem 0 0' }}>
                    <h3 className="text-sm font-bold text-white truncate">
                        {unescapeItemName(listing.itemName)}
                    </h3>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3">

                    <p className="text-xs text-white/90 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Seller: <span className="text-primary font-semibold">{listing.sellerName}</span>
                    </p>

                    {/* Price */}
                    <div>
                        <p className="text-xs text-white/80 mb-1 font-medium">Price</p>
                        <p className="text-xl font-black text-white">
                            ${listing.price}
                        </p>
                    </div>
                </div>
            </div>

            {/* Cancel Button for Owner */}
            {isOwner && onCancel && (
                <div className="absolute -top-2 -right-2 z-50">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCancel(listing.id || '');
                        }}
                        className="btn-circle bg-red-500 hover:bg-red-600 text-white"
                    >
                        <X size={16} />
                    </Button>
                </div>
            )}
        </div>
    );
};
