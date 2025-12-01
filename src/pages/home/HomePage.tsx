import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
    Container,
    Title,
    Stat,
    Grid,
    Button,
    EmptyState,
    Section,
    Stack,
    Text
} from '../../components/ui';
import { useGetUserInventory } from '../../api/generated/inventory/inventory';
import { useGetUserListings, useCancelListing } from '../../api/generated/marketplace/marketplace';
import { useGetUserTrades } from '../../api/generated/trades/trades';
import { InventoryItemCard } from '../inventory/components/InventoryItemCard';
import { ListingCard } from '../marketplace/components/ListingCard';
import { TradeCard } from '../trades/components/TradeCard';
import { ItemDetailModal } from '../marketplace/components/ItemDetailModal';
import { toast } from 'react-hot-toast';
import { Package, Store, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const HomePage = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId') || '';
    const queryClient = useQueryClient();

    const { data: inventory, isLoading: isLoadingInventory } = useGetUserInventory(userId, undefined, {
        query: { enabled: !!userId },
    });

    const { data: listings, isLoading: isLoadingListings } = useGetUserListings(userId, undefined, {
        query: { enabled: !!userId },
    });

    const { data: trades, isLoading: isLoadingTrades } = useGetUserTrades(userId, undefined, {
        query: { enabled: !!userId },
    });

    const { mutate: cancelListing } = useCancelListing();

    const [selectedItem, setSelectedItem] = useState<any>(null);

    const { t } = useLanguage();

    const handleCancel = (listingId: string) => {
        if (confirm('¿Estás seguro de que quieres cancelar este listing?')) {
            cancelListing(
                { listingId, params: { userId } },
                {
                    onSuccess: () => {
                        toast.success('Listing cancelado exitosamente');
                        queryClient.invalidateQueries({ queryKey: ['inventory', userId], refetchType: 'active' });
                        queryClient.invalidateQueries({ queryKey: ['listings', userId], refetchType: 'active' });
                    },
                    onError: () => {
                        toast.error('Error al cancelar el listing');
                    },
                },
            );
        }
    };

    const items = inventory?.content || [];
    const userListings = listings?.content || [];
    const userTrades = trades?.content || [];

    const isLoading = isLoadingInventory || isLoadingListings || isLoadingTrades;

    if (isLoading) {
        return (
            <Container className="py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-8">
            {/* Header */}
            <Stack gap="6" className="mb-12">
                <Title level={1} gradient>{t.home.dashboard}</Title>
                <Text variant="muted" size="lg">
                    {t.home.welcomeMessage}
                </Text>
            </Stack>

            {/* Stats Cards */}
            <Grid cols={3} gap="6" className="mb-16">
                <Stat
                    title={t.home.totalItems}
                    value={inventory?.totalElements || 0}
                    desc={t.home.inYourInventory}
                    figure={<Package />}
                />
                <Stat
                    title={t.home.activeListings}
                    value={listings?.totalElements || 0}
                    desc={t.home.onTheMarketplace}
                    figure={<Store />}
                />
                <Stat
                    title={t.home.activeTrades}
                    value={trades?.totalElements || 0}
                    desc={t.home.inProgress}
                    figure={<RefreshCw />}
                />
            </Grid>

            {/* Recent Inventory Section */}
            <Section>
                <Stack direction="row" className="justify-between items-center mb-6">
                    <Stack gap="2">
                        <Title level={2}>{t.home.recentItems}</Title>
                        <Text variant="muted">{t.home.latestAdditions}</Text>
                    </Stack>
                    <Button variant="ghost" onClick={() => navigate('/inventory')}>
                        {t.home.viewAll} →
                    </Button>
                </Stack>

                {items.length > 0 ? (
                    <Grid cols={4} gap="6">
                        {items.slice(0, 4).map((item) => (
                            <InventoryItemCard
                                key={item.id}
                                item={item}
                                onClick={() => setSelectedItem({
                                    ...item,
                                    itemId: item.catalogItemId,
                                    itemType: item.itemType,
                                    viewCount: 0
                                })}
                            />
                        ))}
                    </Grid>
                ) : (
                    <EmptyState
                        icon="🎮"
                        title={t.home.noItems}
                        description={t.home.startAdding}
                        action={<Button onClick={() => navigate('/inventory')}>{t.home.browseCatalog}</Button>}
                    />
                )}
            </Section>

            {/* Listings Section */}
            <Section>
                <Stack direction="row" className="justify-between items-center mb-6">
                    <Stack gap="2">
                        <Title level={2}>{t.home.yourListings}</Title>
                        <Text variant="muted">{t.home.itemsSelling}</Text>
                    </Stack>
                    <Button variant="ghost" onClick={() => navigate('/marketplace')}>
                        {t.home.viewAll} →
                    </Button>
                </Stack>

                {userListings.length > 0 ? (
                    <Grid cols={4} gap="6">
                        {userListings.slice(0, 4).map((listing) => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                onClick={() => navigate('/marketplace')}
                                onCancel={handleCancel}
                                isOwner
                            />
                        ))}
                    </Grid>
                ) : (
                    <EmptyState
                        icon="🏷️"
                        title={t.home.noListings}
                        description={t.home.startSelling}
                        action={<Button onClick={() => navigate('/inventory')}>{t.home.goToInventory}</Button>}
                    />
                )}
            </Section>

            {/* Trades Section */}
            <Section>
                <Stack direction="row" className="justify-between items-center mb-6">
                    <Stack gap="2">
                        <Title level={2}>{t.home.recentTrades}</Title>
                        <Text variant="muted">{t.home.tradingActivity}</Text>
                    </Stack>
                </Stack>

                {userTrades.length > 0 ? (
                    <Grid cols={2} gap="6" className="lg:grid-cols-2">
                        {userTrades.map((trade) => (
                            <TradeCard
                                key={trade.id}
                                trade={trade}
                                currentUserId={userId}
                                onUpdate={() => window.location.reload()} // Simple reload for now to refresh state
                            />
                        ))}
                    </Grid>
                ) : (
                    <EmptyState
                        icon="🤝"
                        title={t.home.noTrades}
                        description={t.home.startTrading}
                    />
                )}
            </Section>

            <ItemDetailModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
                userInventory={inventory}
            />
        </Container>
    );
};
