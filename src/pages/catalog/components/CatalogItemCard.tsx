import React from 'react';
import { Link } from 'react-router-dom';
import { type CatalogItemSummaryDto } from '../../../api/generated/model';
import { unescapeItemName } from '../../../utils/string';

interface CatalogItemCardProps {
    item: CatalogItemSummaryDto;
    categoryKey: string;
}

export const CatalogItemCard: React.FC<CatalogItemCardProps> = ({ item, categoryKey }) => {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 glass">
            <div className="aspect-h-4 aspect-w-3 sm:aspect-none group-hover:opacity-75 sm:h-96" style={{ backgroundColor: item.rarityColor || '#ffffff', opacity: 0.7 }}>
                <img
                    src={item.image || 'https://placehold.co/300x300'}
                    alt={unescapeItemName(item.name)}
                    className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-sm font-medium text-gray-900">
                    <Link to={`/catalog/${categoryKey}/${item.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {unescapeItemName(item.name)}
                    </Link>
                </h3>
                <div className="flex flex-1 flex-col justify-end">
                    <p className="text-base font-medium text-gray-900">${item.price}</p>
                </div>
            </div>
        </div>
    );
};
