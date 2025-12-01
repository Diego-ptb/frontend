import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { useGetListings, useGetMostViewed, useGetUserListings, useCancelListing } from '../../api/generated/marketplace/marketplace';
import { useGetFilterOptions } from '../../api/generated/filters/filters';
import { useGetUserInventory } from '../../api/generated/inventory/inventory';
import { type ListingDto, type GetListingsParams } from '../../api/generated/model';
import { Container, Title, Grid, Section, Stack, Text, Button, Input, Select } from '../../components/ui';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { MostViewedCard } from './components/MostViewedCard';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

export const MarketplacePage = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isItemDetailModalOpen, setIsItemDetailModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [filters, setFilters] = useState<GetListingsParams>({});
    const currentUserId = localStorage.getItem('userId') || '';
    const currentUsername = localStorage.getItem('username') || '';
    const queryClient = useQueryClient();

    // Embla carousel for most viewed
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        axis: 'y',
        align: 'start',
        slidesToScroll: 1,
        duration: 20
    });

    const scrollPrev = useCallback(() => {
        if (emblaApi) {
            console.log('Scrolling prev');
            emblaApi.scrollPrev();
        } else {
            console.log('Embla API not available for prev');
        }
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) {
            console.log('Scrolling next');
            emblaApi.scrollNext();
        } else {
            console.log('Embla API not available for next');
        }
    }, [emblaApi]);

    const { data: listings, refetch: refetchListings, isLoading: isLoadingListings } = useGetListings(filters, {
        query: {
            staleTime: 0, // Always refetch
            gcTime: 10 * 60 * 1000 // 10 minutes
        }
    });
    const { data: myListings, refetch: refetchMyListings, isLoading: isLoadingMyListings } = useGetUserListings(currentUserId, undefined, {
        query: {
            enabled: !!currentUserId && activeTab === 'my',
            staleTime: 2 * 60 * 1000, // 2 minutes
            gcTime: 5 * 60 * 1000
        }
    });
    const { data: mostViewed, isLoading: isLoadingMostViewed } = useGetMostViewed({ limit: 10 }, {
        query: {
            staleTime: 1 * 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000
        }
    });
    const { data: filterOptions, isLoading: isLoadingFilterOptions } = useGetFilterOptions({
        query: {
            staleTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 30 * 60 * 1000
        }
    });
    const { data: userInventory, isLoading: isLoadingUserInventory } = useGetUserInventory(currentUserId, undefined, {
        query: {
            enabled: !!currentUserId,
            staleTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 30 * 60 * 1000 // 30 minutes
        }
    });

    const { mutate: cancelListing } = useCancelListing();

    // Cast mostViewed to any[] because the API definition is generic object
    const mostViewedItems = (mostViewed as unknown as any[]) || [];

    // Auto-moving carousel for most viewed
    useEffect(() => {
        if (!emblaApi) {
            console.log('Embla API not available');
            return;
        }

        console.log('Setting up autoplay');

        const autoplay = () => {
            console.log('Auto scroll next');
            emblaApi.scrollNext();
        };

        // Start autoplay immediately
        const interval = setInterval(autoplay, 2000);

        // Also listen for init event
        const onInit = () => {
            console.log('Embla initialized');
        };

        emblaApi.on('init', onInit);

        return () => {
            console.log('Clearing autoplay interval');
            clearInterval(interval);
            emblaApi.off('init', onInit);
        };
    }, [emblaApi]);

    useEffect(() => {
        const handleBalanceChanged = () => {
            // Refresh marketplace listings after successful purchase
            refetchListings();
            if (activeTab === 'my') {
                refetchMyListings();
            }
        };

        window.addEventListener('balance-changed', handleBalanceChanged);

        return () => {
            window.removeEventListener('balance-changed', handleBalanceChanged);
        };
    }, [refetchListings, refetchMyListings, activeTab]);

    const handleOpenDetail = (listingId: string) => {
        setSelectedListingId(listingId);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedListingId(null);
    };

    const handleCloseItemDetail = () => {
        setIsItemDetailModalOpen(false);
        setSelectedItem(null);
    };

    const handleCancel = (listingId: string) => {
        if (confirm(t.marketplace.cancelListing)) {
            cancelListing(
                { listingId, params: { userId: currentUserId } },
                {
                    onSuccess: () => {
                        toast.success(t.marketplace.listingCancelled);
                        queryClient.invalidateQueries({ queryKey: ['listings'], refetchType: 'active' });
                        queryClient.invalidateQueries({ queryKey: ['inventory', currentUserId], refetchType: 'active' });
                        refetchListings();
                        refetchMyListings();
                    },
                    onError: () => toast.error(t.marketplace.cancelError)
                },
            );
        }
    };

    // Solo bloquear pantalla completa para carga inicial absoluta
    const isInitialLoading = isLoadingMostViewed || isLoadingFilterOptions || isLoadingUserInventory;

    if (isInitialLoading && !listings && !myListings) {
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
            <div className="flex gap-8">
                {/* Main Content */}
                <div className="flex-1">
                    <Stack gap="8">
                        <Stack gap="2">
                            <Title level={1} gradient>{t.marketplace.title}</Title>
                            <Text variant="muted">{t.marketplace.subtitle}</Text>
                        </Stack>

                        {/* All Listings Section */}
                        <Section>
                            <Stack direction="row" className="justify-between items-center mb-4">
                                <Title level={2}>{activeTab === 'all' ? t.marketplace.activeListings : t.marketplace.myListings}</Title>
                                <div className="flex gap-2">
                                    <Button
                                        variant={activeTab === 'all' ? 'primary' : 'ghost'}
                                        onClick={() => setActiveTab('all')}
                                    >
                                        {t.marketplace.allListings}
                                    </Button>
                                    {currentUserId && (
                                        <Button
                                            variant={activeTab === 'my' ? 'primary' : 'ghost'}
                                            onClick={() => setActiveTab('my')}
                                        >
                                            {t.marketplace.myListings}
                                        </Button>
                                    )}
                                </div>
                            </Stack>

                            {/* Filters Section - Only show for 'all' tab */}
                            {activeTab === 'all' && (
                                <Section className="bg-base-200 rounded-lg p-4">
                                    <Title level={3} className="mb-4">{t.marketplace.filters}</Title>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Category/Type Filter */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t.marketplace.category}</label>
                                            <Select
                                                value={selectedCategory}
                                                onChange={(value) => {
                                                    setSelectedCategory(value);
                                                    // Clear category-specific filters when changing category
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        weapon: undefined,
                                                        rarity: undefined,
                                                        type: undefined,
                                                        effect: undefined,
                                                        team: undefined,
                                                        // Set the type filter based on selected category
                                                        ...(value && { type: value })
                                                    }));
                                                }}
                                                options={[
                                                    { value: '', label: t.inventory.allCategories },
                                                    { value: 'skins', label: t.inventory.skins },
                                                    { value: 'crates', label: t.inventory.crates },
                                                    { value: 'stickers', label: t.inventory.stickers },
                                                    { value: 'agents', label: t.inventory.agents }
                                                ]}
                                            />
                                        </div>

                                        {/* Search */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t.marketplace.search}</label>
                                            <Input
                                                placeholder={t.marketplace.searchPlaceholder}
                                                value={filters.search || ''}
                                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value || undefined }))}
                                            />
                                        </div>

                                        {/* Dynamic filters based on selected category */}
                                        {selectedCategory === 'skins' && (
                                            <>
                                                {/* Weapon */}
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">{t.inventory.weapon}</label>
                                                    <Select
                                                        value={filters.weapon || ''}
                                                        onChange={(value) => setFilters(prev => ({ ...prev, weapon: value || undefined }))}
                                                        options={[
                                                            { value: '', label: t.inventory.allWeapons },
                                                            ...(filterOptions?.skins?.weapons?.filter(w => w.id && w.name).map(w => ({ value: w.id!, label: w.name! })) || [])
                                                        ]}
                                                    />
                                                </div>

                                                {/* Rarity */}
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">{t.inventory.rarity}</label>
                                                    <Select
                                                        value={filters.rarity || ''}
                                                        onChange={(value) => setFilters(prev => ({ ...prev, rarity: value || undefined }))}
                                                        options={[
                                                            { value: '', label: t.inventory.allRarities },
                                                            ...(filterOptions?.skins?.rarities?.filter(r => r.id && r.name).map(r => ({ value: r.id!, label: r.name! })) || [])
                                                        ]}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {selectedCategory === 'crates' && (
                                            <>
                                                {/* Type */}
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Type</label>
                                                    <Select
                                                        value={filters.type || ''}
                                                        onChange={(value) => setFilters(prev => ({ ...prev, type: value || undefined }))}
                                                        options={[
                                                            { value: '', label: 'All Types' },
                                                            ...(filterOptions?.crates?.types?.filter(t => t.id && t.name).map(t => ({ value: t.id!, label: t.name! })) || [])
                                                        ]}
                                                    />
                                                </div>

                                                {/* Rarity */}
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">{t.inventory.rarity}</label>
                                                    <Select
                                                        value={filters.rarity || ''}
                                                        onChange={(value) => setFilters(prev => ({ ...prev, rarity: value || undefined }))}
                                                        options={[
                                                            { value: '', label: t.inventory.allRarities },
                                                            ...(filterOptions?.crates?.rarities?.filter(r => r.id && r.name).map(r => ({ value: r.id!, label: r.name! })) || [])
                                                        ]}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {selectedCategory === 'stickers' && (
                                            <>
                                                {/* Rarity */}
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">{t.inventory.rarity}</label>
                                                    <Select
                                                        value={filters.rarity || ''}
                                                        onChange={(value) => setFilters(prev => ({ ...prev, rarity: value || undefined }))}
                                                        options={[
                                                            { value: '', label: t.inventory.allRarities },
                                                            ...(filterOptions?.stickers?.rarities?.filter(r => r.id && r.name).map(r => ({ value: r.id!, label: r.name! })) || [])
                                                        ]}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {selectedCategory === 'agents' && (
                                            <>
                                                {/* Team */}
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Team</label>
                                                    <Select
                                                        value={filters.team || ''}
                                                        onChange={(value) => setFilters(prev => ({ ...prev, team: value || undefined }))}
                                                        options={[
                                                            { value: '', label: 'All Teams' },
                                                            ...(filterOptions?.agents?.teams?.filter(t => t.id && t.name).map(t => ({ value: t.id!, label: t.name! })) || [])
                                                        ]}
                                                    />
                                                </div>

                                                {/* Rarity */}
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">{t.inventory.rarity}</label>
                                                    <Select
                                                        value={filters.rarity || ''}
                                                        onChange={(value) => setFilters(prev => ({ ...prev, rarity: value || undefined }))}
                                                        options={[
                                                            { value: '', label: t.inventory.allRarities },
                                                            ...(filterOptions?.agents?.rarities?.filter(r => r.id && r.name).map(r => ({ value: r.id!, label: r.name! })) || [])
                                                        ]}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Clear Filters */}
                                        <div className="flex items-end">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setFilters({});
                                                    setSelectedCategory('');
                                                }}
                                                className="w-full"
                                            >
                                                {t.marketplace.clearFilters}
                                            </Button>
                                        </div>
                                    </div>
                                </Section>
                            )}

                            {activeTab === 'all' ? (
                                <div className="max-h-[600px] overflow-visible">
                                    {isLoadingListings ? (
                                        <div className="flex justify-center items-center py-12">
                                            <span className="loading loading-spinner loading-lg text-primary"></span>
                                        </div>
                                    ) : (
                                        <Grid cols={5} gap="4" className="overflow-visible">
                                            {listings?.content?.map((listing: ListingDto) => (
                                                <ListingCard
                                                    key={listing.id}
                                                    listing={listing}
                                                    onClick={() => handleOpenDetail(listing.id || '')}
                                                    isOwner={listing.sellerName === currentUsername}
                                                    onCancel={handleCancel}
                                                />
                                            ))}
                                        </Grid>
                                    )}
                                </div>
                            ) : (
                                <div className="max-h-[600px] overflow-visible">
                                    {isLoadingMyListings ? (
                                        <div className="flex justify-center items-center py-12">
                                            <span className="loading loading-spinner loading-lg text-primary"></span>
                                        </div>
                                    ) : (
                                        <Grid cols={5} gap="4" className="overflow-visible">
                                            {myListings?.content?.length === 0 ? (
                                                <div className="col-span-5 text-center py-12 text-text-muted">
                                                    {t.marketplace.noActiveListings}
                                                </div>
                                            ) : (
                                                myListings?.content?.map((listing: ListingDto) => (
                                                    <ListingCard
                                                        key={listing.id}
                                                        listing={listing}
                                                        onClick={() => handleOpenDetail(listing.id || '')}
                                                        isOwner={true}
                                                        onCancel={handleCancel}
                                                    />
                                                ))
                                            )}
                                        </Grid>
                                    )}
                                </div>
                            )}
                        </Section>
                    </Stack>
                </div>

                {/* Most Viewed Section - Right Sidebar */}
                {mostViewedItems.length > 0 && (
                    <div className="w-80 flex-shrink-0">
                        <Section>
                            <Title level={2} className="mb-4">🔥 {t.marketplace.mostViewed}</Title>
                            <div className="relative overflow-hidden h-[800px]">
                                {/* Up Arrow */}
                                {mostViewedItems.length > 1 && (
                                    <button
                                        onClick={scrollPrev}
                                        className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </button>
                                )}

                                {/* Down Arrow */}
                                {mostViewedItems.length > 1 && (
                                    <button
                                        onClick={scrollNext}
                                        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}

                                <div className="embla overflow-hidden h-full" ref={emblaRef}>
                                    <div className="embla__container flex flex-col">
                                        {mostViewedItems.map((item: any, index: number) => (
                                            <div key={item.itemId || `most-viewed-${index}`} className="embla__slide flex-shrink-0 mb-4">
                                                <MostViewedCard
                                                    item={item}
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setIsItemDetailModalOpen(true);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </div>
                )}
            </div>

            <ListingDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetail}
                listingId={selectedListingId}
            />

            <ItemDetailModal
                isOpen={isItemDetailModalOpen}
                onClose={handleCloseItemDetail}
                item={selectedItem}
                userInventory={userInventory}
            />
        </Container>
    );
};
