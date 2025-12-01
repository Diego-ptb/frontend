import { useState, useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getItemsByCategory } from '../../../api/generated/catalog/catalog';
import { useAddToInventory } from '../../../api/generated/inventory/inventory';
import { useGetFilterOptions } from '../../../api/generated/filters/filters';
import Grid from '../../../components/ui/Grid';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useInView } from 'react-intersection-observer';
import { type CatalogItemSummaryDto } from '../../../api/generated/model';
import { unescapeItemName } from '../../../utils/string';
import { useLanguage } from '../../../context/LanguageContext';

interface CatalogSelectorProps {
    onItemAdded: () => void;
}

interface CatalogSelectorProps {
    onItemAdded: () => void;
}

export const CatalogSelector = ({ onItemAdded }: CatalogSelectorProps) => {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<{
        weapon?: string;
        rarity?: string;
        type?: string;
        team?: string;
    }>({
        weapon: undefined,
        rarity: undefined,
        type: undefined,
        team: undefined,
    });

    const { data: filterOptions, isLoading: isLoadingFilterOptions } = useGetFilterOptions({
        query: {
            staleTime: 60 * 60 * 1000, // 1 hour
            gcTime: 24 * 60 * 60 * 1000 // 24 hours
        }
    });

    const { mutate: addToInventory } = useAddToInventory();
    const queryClient = useQueryClient();
    const userId = localStorage.getItem('userId') || '';

    // Generate categories dynamically from filterOptions
    const categories = filterOptions ? Object.keys(filterOptions).filter(key => {
        const categoryData = filterOptions[key as keyof typeof filterOptions];
        // Only include categories that have actual filter data
        return categoryData && (
            (categoryData as any).weapons ||
            (categoryData as any).rarities ||
            (categoryData as any).types ||
            (categoryData as any).teams
        );
    }).map(key => ({
        key,
        name: t.inventory[key as keyof typeof t.inventory] as string || key.charAt(0).toUpperCase() + key.slice(1)
    })) : [];

    useEffect(() => {
        if (categories && categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0].key || null);
        }
    }, [categories, selectedCategory]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['catalog', selectedCategory, searchQuery, filters],
        queryFn: ({ pageParam = 0 }) =>
            getItemsByCategory(selectedCategory || '', {
                page: pageParam,
                size: 20,
                search: searchQuery || undefined,
                weapon: filters.weapon,
                rarity: filters.rarity,
                type: filters.type,
                team: filters.team,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined;
            return (lastPage.number || 0) + 1;
        },
        staleTime: 15 * 60 * 1000, // 15 minutes for catalog
        gcTime: 60 * 60 * 1000, // 1 hour
        enabled: !!selectedCategory,
    });

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    const allItems = data?.pages.flatMap((page) => page.content || []) || [];

    const handleAddItem = (item: CatalogItemSummaryDto) => {
        addToInventory({
            data: {
                userId,
                category: selectedCategory || '',
                itemId: item.id,
                acquiredPrice: item.price
            }
        }, {
            onSuccess: () => {
                alert(t.inventory.addItemModal.itemAdded.replace('{{itemName}}', unescapeItemName(item.name)));
                queryClient.invalidateQueries({ queryKey: ['inventory', userId], refetchType: 'active' });
                onItemAdded();
            }
        });
    };

    const isLoading = isLoadingFilterOptions;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[600px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px]">
            {/* Fixed Header */}
            <div className="flex-shrink-0 space-y-4 p-6 border-b border-base-300">
                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories?.map((category) => (
                        <Button
                            key={category.key}
                            variant={selectedCategory === category.key ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => {
                                setSelectedCategory(category.key || null);
                                // Clear category-specific filters when changing category
                                setFilters({
                                    weapon: undefined,
                                    rarity: undefined,
                                    type: undefined,
                                    team: undefined,
                                });
                            }}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>

                {/* Search */}
                <div className="w-full">
                    <Input
                        placeholder={t.inventory.addItemModal.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {/* Dynamic filters based on selected category */}
                    {selectedCategory === 'skins' && (
                        <>
                            {/* Weapon Filter */}
                            <div>
                                <Select
                                    options={[
                                        { value: '', label: t.inventory.addItemModal.allWeapons },
                                        ...(filterOptions?.skins?.weapons?.filter(w => w.id && w.name).map(w => ({ value: w.id!, label: w.name! })) || [])
                                    ]}
                                    value={filters.weapon || ''}
                                    onChange={(value) => setFilters(prev => ({ ...prev, weapon: value || undefined }))}
                                />
                            </div>

                            {/* Rarity Filter */}
                            <div>
                                <Select
                                    options={[
                                        { value: '', label: t.inventory.addItemModal.allRarities },
                                        ...(filterOptions?.skins?.rarities?.filter(r => r.id && r.name).map(r => ({ value: r.id!, label: r.name! })) || [])
                                    ]}
                                    value={filters.rarity || ''}
                                    onChange={(value) => setFilters(prev => ({ ...prev, rarity: value || undefined }))}
                                />
                            </div>
                        </>
                    )}

                    {selectedCategory === 'crates' && (
                        <>
                            {/* Type Filter */}
                            <div>
                                <Select
                                    options={[
                                        { value: '', label: t.inventory.addItemModal.allTypes },
                                        ...(filterOptions?.crates?.types?.filter(t => t.id && t.name).map(t => ({ value: t.id!, label: t.name! })) || [])
                                    ]}
                                    value={filters.type || ''}
                                    onChange={(value) => setFilters(prev => ({ ...prev, type: value || undefined }))}
                                />
                            </div>

                            {/* Rarity Filter */}
                            <div>
                                <Select
                                    options={[
                                        { value: '', label: t.inventory.addItemModal.allRarities },
                                        ...(filterOptions?.crates?.rarities?.filter(r => r.id && r.name).map(r => ({ value: r.id!, label: r.name! })) || [])
                                    ]}
                                    value={filters.rarity || ''}
                                    onChange={(value) => setFilters(prev => ({ ...prev, rarity: value || undefined }))}
                                />
                            </div>
                        </>
                    )}

                    {selectedCategory === 'stickers' && (
                        <>
                            {/* Type Filter */}
                            <div>
                                <Select
                                    options={[
                                        { value: '', label: t.inventory.addItemModal.allTypes },
                                        ...(filterOptions?.stickers?.types?.filter(t => t.id && t.name).map(t => ({ value: t.id!, label: t.name! })) || [])
                                    ]}
                                    value={filters.type || ''}
                                    onChange={(value) => setFilters(prev => ({ ...prev, type: value || undefined }))}
                                />
                            </div>

                            {/* Rarity Filter */}
                            <div>
                                <Select
                                    options={[
                                        { value: '', label: t.inventory.addItemModal.allRarities },
                                        ...(filterOptions?.stickers?.rarities?.filter(r => r.id && r.name).map(r => ({ value: r.id!, label: r.name! })) || [])
                                    ]}
                                    value={filters.rarity || ''}
                                    onChange={(value) => setFilters(prev => ({ ...prev, rarity: value || undefined }))}
                                />
                            </div>
                        </>
                    )}

                    {selectedCategory === 'agents' && (
                        <>
                            {/* Team Filter */}
                            <div>
                                <Select
                                    options={[
                                        { value: '', label: t.inventory.addItemModal.allTeams },
                                        ...(filterOptions?.agents?.teams?.filter(t => t.id && t.name).map(t => ({ value: t.id!, label: t.name! })) || [])
                                    ]}
                                    value={filters.team || ''}
                                    onChange={(value) => setFilters(prev => ({ ...prev, team: value || undefined }))}
                                />
                            </div>

                            {/* Rarity Filter */}
                            <div>
                                <Select
                                    options={[
                                        { value: '', label: t.inventory.addItemModal.allRarities },
                                        ...(filterOptions?.agents?.rarities?.filter(r => r.id && r.name).map(r => ({ value: r.id!, label: r.name! })) || [])
                                    ]}
                                    value={filters.rarity || ''}
                                    onChange={(value) => setFilters(prev => ({ ...prev, rarity: value || undefined }))}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Items Grid */}
                {status === 'pending' ? (
                    <Grid cols={4} gap="6" className="sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="skeleton h-80 rounded-2xl" />
                        ))}
                    </Grid>
                ) : status === 'error' ? (
                    <div className="flex justify-center py-16 glass rounded-2xl">
                        <p className="text-red-400 font-semibold">Error loading items</p>
                    </div>
                ) : allItems.length === 0 ? (
                    <div className="flex justify-center py-16 glass rounded-2xl">
                        <p className="text-text-muted">No items found.</p>
                    </div>
                ) : (
                    <Grid cols={4} gap="6" className="sm:grid-cols-2 lg:grid-cols-4">
                        {allItems.map((item) => {
                            const borderColor = item.rarityColor || '#ffffff';
                            return (
                                <div
                                    key={item.id}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl glass border-2 hover-lift hover-glow transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="h-48 w-full overflow-hidden p-3" style={{ backgroundColor: borderColor }}>
                                        <img
                                            src={item.image || 'https://placehold.co/150x150'}
                                            alt={unescapeItemName(item.name || 'Item')}
                                            className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow p-4">
                                        <h3 className="text-sm font-bold text-base-content truncate mb-1">
                                            {unescapeItemName(item.name)}
                                        </h3>
                                        <Button
                                            size="sm"
                                            fullWidth
                                            onClick={() => handleAddItem(item)}
                                            className="rounded-none bg-primary hover:bg-primary-focus text-primary-content font-semibold py-2 px-4 shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            {t.catalog.addToInventory}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </Grid>
                )}

                {/* Load More Indicator */}
                <div ref={ref} className="flex justify-center h-8 mt-6">
                    {isFetchingNextPage && (
                        <div className="flex items-center gap-2 glass px-4 py-2 rounded-lg">
                            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-base-content/70">Loading more...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

