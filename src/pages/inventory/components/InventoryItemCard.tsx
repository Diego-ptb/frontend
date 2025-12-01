import React from 'react';
import { type InventoryItemDto } from '../../../api/generated/model';
import Badge from '../../../components/ui/Badge';
import Stack from '../../../components/ui/Stack';
import { unescapeItemName } from '../../../utils/string';
import { Package } from 'lucide-react';

const getWearCategoryColor = (category: string): string => {
    switch (category) {
        case "Recién fabricado": return "#00FF00";
        case "Casi nuevo": return "#9ACD32";
        case "Algo desgastado": return "#FFD700";
        case "Bastante desgastado": return "#FFA500";
        case "Deplorable": return "#FF0000";
        default: return "#666666";
    }
};

const calculateWearCategory = (wearValue: number): string => {
    if (wearValue < 0.07) {
        return "Recién fabricado";
    } else if (wearValue <= 0.15) {
        return "Casi nuevo";
    } else if (wearValue <= 0.38) {
        return "Algo desgastado";
    } else if (wearValue <= 0.45) {
        return "Bastante desgastado";
    } else {
        return "Deplorable";
    }
};

interface InventoryItemCardProps {
    item: InventoryItemDto;
    onClick?: () => void;
}

export const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item, onClick }) => {
    return (
        <div
            className={`group relative overflow-visible rounded-2xl border border-base-300 dark:border-base-content/10 bg-base-100 dark:bg-base-200 shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl hover-lift transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            {/* Image Container */}
            <div
                className="relative h-64 w-full overflow-hidden rounded-2xl"
                style={{ backgroundColor: item.rarityColor || '#ffffff' }}
            >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-5 rounded-2xl"></div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-2xl"></div>

                {/* Item Name Overlay */}
                <div className="absolute top-0 left-0 right-0 bg-black/70 dark:bg-black/80 p-2 z-20" style={{ borderRadius: '1rem 1rem 0 0' }}>
                    <h3 className="text-sm font-bold text-white truncate">
                        {unescapeItemName(item.itemName)}
                    </h3>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3">
                    <div className="text-xs text-white/90 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.category && <div>Category: {item.category}</div>}
                        {item.wearCategory && <div style={{ color: getWearCategoryColor(item.wearCategory) }}>Wear: {item.wearCategory}</div>}
                        {!item.wearCategory && item.wearValue !== undefined && <div style={{ color: getWearCategoryColor(calculateWearCategory(item.wearValue)) }}>Wear: {calculateWearCategory(item.wearValue)}</div>}
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute bottom-1 right-1 flex gap-1 z-30">
                    {item.rarityColor && (
                        <Badge variant="primary" className="text-xs">
                            {item.rarityName || 'Rare'}
                        </Badge>
                    )}
                </div>

                {item.image ? (
                    <img
                        src={item.image}
                        alt={unescapeItemName(item.itemName || 'Item')}
                        className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110 relative z-0"
                    />
                ) : (
                    <Stack className="h-full items-center justify-center relative z-0">
                        <Package className="text-6xl opacity-30" />
                    </Stack>
                )}
            </div>
        </div>
    );
};
