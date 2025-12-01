import Badge from '../../../components/ui/Badge';
import { unescapeItemName } from '../../../utils/string';
import { Eye } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface MostViewedItem {
    itemId: string;
    itemName: string;
    image?: string;
    rarityName?: string;
    rarityColor?: string;
    viewCount?: number;
}

interface MostViewedCardProps {
    item: MostViewedItem;
    onClick: () => void;
}

export const MostViewedCard = ({ item, onClick }: MostViewedCardProps) => {
    const { t } = useLanguage();

    return (
        <div
            className="group relative overflow-visible rounded-2xl border border-base-300 dark:border-base-content/10 bg-base-100 dark:bg-base-200 shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl hover-lift transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div
                className="relative h-32 w-full overflow-hidden rounded-2xl"
                style={{ backgroundColor: item.rarityColor || '#ffffff' }}
            >
                <img
                    src={item.image || 'https://placehold.co/300x300'}
                    alt={unescapeItemName(item.itemName)}
                    className="h-full w-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-5 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-2xl"></div>

                {/* Title with view count */}
                <div className="absolute top-0 left-0 right-0 bg-black/70 dark:bg-black/80 p-2 z-20 flex items-center justify-between" style={{ borderRadius: '1rem 1rem 0 0' }}>
                    <h3 className="text-sm font-bold text-white truncate flex-1 mr-2">
                        {unescapeItemName(item.itemName)}
                    </h3>
                    <div className="flex items-center gap-1 text-white text-xs font-medium flex-shrink-0">
                        <Eye size={12} />
                        <span>{item.viewCount || 0}</span>
                    </div>
                </div>

                {/* Side gradient overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/60 to-transparent z-25"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/60 to-transparent z-25"></div>

                {/* Bottom badges */}
                <div className="absolute bottom-1 left-1 flex gap-1 z-30">
                    {item.rarityName && (
                        <div
                            className="rounded-full px-2 py-0.5 text-xs font-semibold shadow-lg text-white"
                            style={{ backgroundColor: item.rarityColor || '#374151' }}
                        >
                            {item.rarityName}
                        </div>
                    )}
                    <Badge variant="warning" className="text-xs font-semibold shadow-lg">
                        {t.marketplace.hot}
                    </Badge>
                </div>
            </div>
        </div>
    );
};