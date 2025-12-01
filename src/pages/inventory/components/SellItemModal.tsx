import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal, Stack, Button, Label, Input, Text } from '../../../components/ui';
import { useCreateListing, useGetSuggestedPrice, useGetPriceHistory } from '../../../api/generated/marketplace/marketplace';
import { useUpdateItem } from '../../../api/generated/inventory/inventory';
import { type InventoryItemDto } from '../../../api/generated/model';
import { unescapeItemName } from '../../../utils/string';
import { PriceHistoryChart } from '../../../components/PriceHistoryChart';
import { useLanguage } from '../../../context/LanguageContext';

interface SellItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItemDto | null;
    onSuccess: () => void;
}

export const SellItemModal: React.FC<SellItemModalProps> = ({ isOpen, onClose, item, onSuccess }) => {
    const { t } = useLanguage();
    const userId = localStorage.getItem('userId') || '';
    const queryClient = useQueryClient();
    const { mutate: createListing, isPending: isCreatingListing } = useCreateListing();
    const { mutate: updateItem, isPending: isUpdatingItem } = useUpdateItem();

    const [price, setPrice] = useState<string>('');
    const [stattrak, setStattrak] = useState<boolean>(false);
    const [souvenir, setSouvenir] = useState<boolean>(false);
    const [wearValue, setWearValue] = useState<string>('');

    // Fetch suggested price
    const { data: suggestedPriceData, isLoading: isLoadingSuggestedPrice } = useGetSuggestedPrice(
        item?.itemType || 'skin', // Use itemType instead of category
        item?.catalogItemId || '', // Use catalogItemId instead of id
        { query: { enabled: !!item?.catalogItemId && isOpen } }
    );

    // Fetch price history
    const { data: priceHistoryData } = useGetPriceHistory(
        item?.itemType || 'skin',
        item?.catalogItemId || '',
        { limit: 10 },
        { query: { enabled: !!item?.catalogItemId && isOpen } }
    );

    // Initialize form values when item changes
    useEffect(() => {
        if (item) {
            setStattrak(item.stattrak || false);
            setSouvenir(item.souvenir || false);
            if (item.minFloat !== null && item.maxFloat !== null) {
                setWearValue(item.wearValue?.toString() || (((item.minFloat || 0) + (item.maxFloat || 1)) / 2).toString());
            } else {
                setWearValue('');
            }
        }
    }, [item]);

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

    const handleSell = () => {
        if (!item?.id || !price) return;

        const hasWearRange = item?.minFloat !== null && item?.maxFloat !== null;
        if (hasWearRange && !wearValue) return;

        if (hasWearRange) {
            const wear = parseFloat(wearValue);
            if (wear < (item.minFloat || 0) || wear > (item.maxFloat || 1)) {
                alert('Wear value must be within the allowed range');
                return;
            }
        }

        const needsUpdate = (stattrak !== (item.stattrak || false)) || (souvenir !== (item.souvenir || false)) || (hasWearRange && parseFloat(wearValue) !== (item.wearValue || 0));

        if (needsUpdate) {
            // Update item first
            const updateData: any = {
                stattrak,
                souvenir
            };
            if (hasWearRange) {
                updateData.wearValue = parseFloat(wearValue);
            }

            updateItem({
                itemId: item.id,
                data: updateData
            }, {
                onSuccess: () => {
                    // Then create listing
                    createListing({
                        data: {
                            userId,
                            inventoryItemId: item.id,
                            price: parseFloat(price)
                        }
                    }, {
                        onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ['inventory', userId], refetchType: 'active' });
                            queryClient.invalidateQueries({ queryKey: ['listings'], refetchType: 'active' });
                            onSuccess();
                            onClose();
                        },
                        onError: () => {
                            alert('Failed to create listing');
                        }
                    });
                },
                onError: () => {
                    alert('Failed to update item');
                }
            });
        } else {
            // Just create listing
            createListing({
                data: {
                    userId,
                    inventoryItemId: item.id,
                    price: parseFloat(price)
                }
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['inventory', userId], refetchType: 'active' });
                    queryClient.invalidateQueries({ queryKey: ['listings'], refetchType: 'active' });
                    onSuccess();
                    onClose();
                },
                onError: () => {
                    alert('Failed to create listing');
                }
            });
        }
    };

    if (!item) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Sell ${unescapeItemName(item.itemName)}`}>
            <Stack gap="4">
                <div className="bg-base-200 p-4 rounded-lg flex items-center gap-4">
                    {item.image && (
                        <img src={item.image} alt={unescapeItemName(item.itemName)} className="w-16 h-16 object-contain" />
                    )}
                    <div>
                        <Text className="font-bold">{unescapeItemName(item.itemName)}</Text>
                        <Text variant="muted" size="sm">{item.category}</Text>
                    </div>
                </div>

                <Stack gap="3">
                    <Text className="font-semibold">Item Properties</Text>

                    {item?.canHaveStattrak && (
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="stattrak"
                                checked={stattrak}
                                onChange={(e) => {
                                    setStattrak(e.target.checked);
                                    if (e.target.checked) setSouvenir(false);
                                }}
                                className="checkbox checkbox-primary"
                            />
                            <Label htmlFor="stattrak" className="cursor-pointer">StatTrak</Label>
                        </div>
                    )}

                    {item?.canHaveSouvenir && (
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="souvenir"
                                checked={souvenir}
                                onChange={(e) => {
                                    setSouvenir(e.target.checked);
                                    if (e.target.checked) setStattrak(false);
                                }}
                                className="checkbox checkbox-primary"
                            />
                            <Label htmlFor="souvenir" className="cursor-pointer">Souvenir</Label>
                        </div>
                    )}

                    {item?.minFloat !== null && item?.maxFloat !== null && (
                        <div>
                            <Label htmlFor="wearValue">Wear Value (Quality): {wearValue}</Label>
                            <div className="flex gap-4 items-center">
                                <input
                                    id="wearValue"
                                    type="range"
                                    min={item?.minFloat || 0}
                                    max={item?.maxFloat || 1}
                                    step="0.0001"
                                    value={wearValue}
                                    onChange={(e) => setWearValue(e.target.value)}
                                    className="range range-primary flex-1"
                                />
                                <Input
                                    type="number"
                                    min={item?.minFloat || 0}
                                    max={item?.maxFloat || 1}
                                    step="0.0001"
                                    value={wearValue}
                                    onChange={(e) => setWearValue(e.target.value)}
                                    className="w-24"
                                    placeholder="0.0000"
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span
                                    className="text-sm"
                                    style={{ color: wearValue ? getWearCategoryColor(calculateWearCategory(parseFloat(wearValue))) : '#666666' }}
                                >
                                    {wearValue ? calculateWearCategory(parseFloat(wearValue)) : 'Selecciona un valor'}
                                </span>
                                {item?.minFloat !== undefined && item?.maxFloat !== undefined && (
                                    <Text variant="muted" size="sm">
                                        Range: {item.minFloat} - {item.maxFloat}
                                    </Text>
                                )}
                            </div>
                        </div>
                    )}
                </Stack>

                <div>
                    <Label>Price ($)</Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        fullWidth
                    />
                    {isLoadingSuggestedPrice ? (
                        <Text variant="muted" size="sm" className="mt-1">
                            <span className="loading loading-spinner loading-sm"></span> Loading suggested price...
                        </Text>
                    ) : suggestedPriceData !== undefined && suggestedPriceData > 0 ? (
                        <Text variant="muted" size="sm" className="mt-1">
                            {t.marketplace.suggestedPriceText} <span className="text-primary">${Number(suggestedPriceData).toFixed(2)}</span>
                        </Text>
                    ) : suggestedPriceData !== undefined && suggestedPriceData === 0 ? (
                        <Text variant="muted" size="sm" className="mt-1">
                            {t.marketplace.suggestedPriceText} {t.marketplace.noSuggestedPriceData}
                        </Text>
                    ) : null}
                </div>

                {/* Price History Section */}
                <div>
                    <Label>Price History</Label>
                    <PriceHistoryChart data={(priceHistoryData || []).filter(item => item.price !== undefined && item.soldAt !== undefined).map(item => ({ price: item.price!, soldAt: item.soldAt! }))} />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSell} loading={isUpdatingItem || isCreatingListing} disabled={!price || parseFloat(price) <= 0 || ((item?.minFloat !== null && item?.maxFloat !== null) && !wearValue)}>
                        Vender
                    </Button>
                </div>
            </Stack>
        </Modal>
    );
};
