import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal, Stack, Button, Text, Badge } from '../../../components/ui';
import { useGetListingDetails, useBuyListing } from '../../../api/generated/marketplace/marketplace';
import { useGetCurrentUser } from '../../../api/generated/users/users';
import { unescapeItemName } from '../../../utils/string';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';

interface ListingDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    listingId: string | null;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ isOpen, onClose, listingId }) => {
    const { t } = useLanguage();
    const currentUserId = localStorage.getItem('userId') || '';
    const currentUsername = localStorage.getItem('username') || '';
    const queryClient = useQueryClient();

    const { data: listing, isLoading } = useGetListingDetails(listingId || '', {
        query: { enabled: !!listingId && isOpen }
    });

    const { data: currentUser } = useGetCurrentUser({ query: { enabled: !!currentUserId && isOpen } });

    const { mutate: buyListing, isPending: isBuying } = useBuyListing();

    const handleBuy = () => {
        if (!listing?.id || !currentUserId) return;

        if (listing.sellerName === currentUsername) {
            toast.error('You cannot buy your own listing');
            return;
        }

        if (confirm(`Buy ${unescapeItemName(listing.itemName)} for $${listing.price}?`)) {
            buyListing(
                { listingId: listing.id, params: { buyerId: currentUserId } },
                {
                    onSuccess: () => {
                        toast.success('Item purchased successfully!');
                        queryClient.invalidateQueries({ queryKey: ['listings'], refetchType: 'active' });
                        queryClient.invalidateQueries({ queryKey: ['inventory', currentUserId], refetchType: 'active' });
                        window.dispatchEvent(new Event('balance-changed'));
                        onClose();
                    },
                    onError: () => toast.error('Failed to purchase item')
                }
            );
        }
    };

    const getWearCategoryColor = (category: string): string => {
        switch (category) {
            case "Factory New": return "#4ade80";
            case "Minimal Wear": return "#22c55e";
            case "Field-Tested": return "#eab308";
            case "Well-Worn": return "#f97316";
            case "Battle-Scarred": return "#ef4444";
            default: return "#666666";
        }
    };

    if (!listingId) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.marketplace.listingDetails}>
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            ) : listing ? (
                <Stack gap="6">
                    {/* Item Image and Basic Info */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src={listing.itemImage || 'https://placehold.co/300x300'}
                                alt={unescapeItemName(listing.itemName)}
                                className="w-48 h-48 object-contain rounded-lg border"
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">
                                {unescapeItemName(listing.itemName)}
                            </h2>

                            <div className="space-y-2 mb-4">
                                <Text variant="muted">
                                    {t.marketplace.seller} <span className="font-semibold text-primary">{listing.sellerName}</span>
                                </Text>

                                {listing.createdAt && (
                                    <Text variant="muted">
                                        {t.marketplace.listed} <span className="font-semibold">{new Date(listing.createdAt).toLocaleDateString()}</span>
                                    </Text>
                                )}
                            </div>

                            {/* Price */}
                            <div className="bg-base-200 p-4 rounded-lg">
                                <Text className="text-sm text-muted mb-1">{t.marketplace.price}</Text>
                                <Text className="text-3xl font-black text-primary">
                                    ${listing.price}
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="bg-base-200 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">{t.catalog.itemDetails}</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {listing.status && (
                                <div>
                                    <Text className="text-sm text-muted mb-1">{t.marketplace.status}</Text>
                                    <Badge variant={listing.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                        {listing.status}
                                    </Badge>
                                </div>
                            )}

                            {listing.minFloat !== null && listing.maxFloat !== null && (
                                <div>
                                    <Text className="text-sm text-muted mb-1">Wear Range</Text>
                                    <Text>{listing.minFloat} - {listing.maxFloat}</Text>
                                </div>
                            )}

                            {listing.wearValue !== undefined && listing.wearValue !== null && (
                                <div>
                                    <Text className="text-sm text-muted mb-1">Wear Value</Text>
                                    <div className="flex items-center gap-2">
                                        <Text>{listing.wearValue.toFixed(4)}</Text>
                                        {listing.wearCategory && (
                                            <span
                                                className="px-2 py-1 rounded text-xs font-semibold"
                                                style={{
                                                    backgroundColor: getWearCategoryColor(listing.wearCategory),
                                                    color: 'white'
                                                }}
                                            >
                                                {listing.wearCategory}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            {t.marketplace.close}
                        </Button>

                        {listing.sellerName !== currentUsername && (
                            <Button
                                onClick={handleBuy}
                                loading={isBuying}
                                disabled={!currentUserId || (currentUser?.balance ?? 0) < (listing.price ?? 0)}
                            >
                                {t.marketplace.buyNow} - ${listing.price}
                            </Button>
                        )}

                        {listing.sellerName === currentUsername && (
                            <Button variant="secondary" disabled>
                                {t.marketplace.yourListing}
                            </Button>
                        )}
                    </div>
                </Stack>
            ) : (
                <div className="text-center py-12">
                    <Text variant="muted">{t.marketplace.listingNotFound}</Text>
                </div>
            )}
        </Modal>
    );
};