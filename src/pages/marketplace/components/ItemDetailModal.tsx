import React from 'react';
import { Modal, Stack, Button, Text } from '../../../components/ui';
import { useGetSuggestedPrice, useGetPriceHistory } from '../../../api/generated/marketplace/marketplace';
import { unescapeItemName } from '../../../utils/string';
import { SellItemModal } from '../../inventory/components/SellItemModal';
import { PriceHistoryChart } from '../../../components/PriceHistoryChart';
import { useLanguage } from '../../../context/LanguageContext';

interface ItemDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any; // CatalogItemSummaryDto or similar
    userInventory?: any;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ isOpen, onClose, item, userInventory }) => {
    const { t } = useLanguage();
    const { data: suggestedPrice, isLoading: isLoadingSuggestedPrice } = useGetSuggestedPrice(item?.itemType || 'skin', item?.itemId || '', {
        query: {
            enabled: isOpen,
            staleTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 30 * 60 * 1000
        }
    });

    const { data: priceHistory } = useGetPriceHistory(item?.itemType || 'skin', item?.itemId || '', { limit: 10 }, {
        query: {
            enabled: isOpen,
            staleTime: 10 * 60 * 1000,
            gcTime: 30 * 60 * 1000
        }
    });

    const inventory = userInventory;

    const inventoryItem = inventory?.content?.find((invItem: any) => invItem.catalogItemId === item?.itemId);

    const suggestedPriceValue = (suggestedPrice as any)?.suggestedPrice ?? (suggestedPrice as any);
    const historyArray = (priceHistory as any)?.history ?? (priceHistory as any);

    const [showSellModal, setShowSellModal] = React.useState(false);

    const handleSell = () => {
        setShowSellModal(true);
    };

    const handleSellSuccess = () => {
        setShowSellModal(false);
        onClose();
    };

    if (!item) return null;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={t.catalog.itemDetails} size="lg">
                <Stack gap="6">
                    {/* Item Image and Basic Info */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src={item.image || 'https://placehold.co/300x300'}
                                alt={unescapeItemName(item.itemName)}
                                className="w-48 h-48 object-contain rounded-lg border"
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">
                                {unescapeItemName(item.itemName)}
                            </h2>

                            <div className="space-y-2 mb-4">
                                <Text variant="muted">
                                    {t.marketplace.viewedTimes.replace('{{count}}', String(item.viewCount || 0))}
                                </Text>
                            </div>

                            {/* Suggested Price */}
                            <div className="bg-base-200 p-4 rounded-lg mb-4">
                                <Text className="text-sm text-muted mb-1">{t.catalog.suggestedPriceLabel}</Text>
                                {isLoadingSuggestedPrice ? (
                                    <div className="flex items-center gap-2">
                                        <span className="loading loading-spinner loading-sm"></span>
                                        <Text className="text-muted">Loading...</Text>
                                    </div>
                                ) : (
                                    <Text className="text-3xl font-black text-primary">
                                        ${suggestedPriceValue?.toFixed(2) || 'N/A'}
                                    </Text>
                                )}
                            </div>

                            {/* Sell Button if user has the item */}
                            {inventoryItem && (
                                <Button onClick={handleSell} className="w-full">
                                    {t.catalog.sellThisItem}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Price History */}
                    <div>
                        <Text className="text-lg font-semibold mb-4">{t.catalog.priceHistory}</Text>
                        <PriceHistoryChart data={historyArray || []} />
                    </div>
                </Stack>
            </Modal>

            {inventoryItem && (
                <SellItemModal
                    isOpen={showSellModal}
                    onClose={() => setShowSellModal(false)}
                    item={inventoryItem}
                    onSuccess={handleSellSuccess}
                />
            )}
        </>
    );
};
