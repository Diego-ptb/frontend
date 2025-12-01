import { useState } from 'react';
import {
    Container,
    Title,
    Button,
    Grid,
    Modal,
    EmptyState,
    Section,
    Stack,
    Text,
    Input,
    Select
} from '../../components/ui';
import { useGetUserInventory } from '../../api/generated/inventory/inventory';
import { useGetFilterOptions } from '../../api/generated/filters/filters';
import { type InventoryItemDto, type GetUserInventoryParams } from '../../api/generated/model';
import { InventoryItemCard } from './components/InventoryItemCard';
import { CatalogSelector } from './components/CatalogSelector';
import { SellItemModal } from './components/SellItemModal';
import { ItemDetailModal } from '../marketplace/components/ItemDetailModal';
import { Package, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const InventoryPage = () => {
    const { t } = useLanguage();
    const userId = localStorage.getItem('userId') || '';
    const [showCatalogModal, setShowCatalogModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [filters, setFilters] = useState<GetUserInventoryParams>({
        status: 'ACTIVE'
    });

    const [sellingItem, setSellingItem] = useState<InventoryItemDto | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const { data: inventory, refetch, isLoading, isFetching } = useGetUserInventory(userId, filters, {
        query: {
            enabled: !!userId,
            staleTime: 0, // Always refetch when entering the page
            gcTime: 30 * 60 * 1000
        }
    });

    const { data: filterOptions } = useGetFilterOptions({
        query: {
            staleTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 30 * 60 * 1000
        }
    });

    const items = inventory?.content || [];

    // No need for local filtering since API now handles status filtering
    const filteredItems = items;



    const handleSuccess = () => {
        refetch();
        setSellingItem(null);
    };

    // Show initial loading only when there's no data yet
    const isInitialLoading = isLoading && !inventory;

    if (isInitialLoading) {
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
            <Stack direction="row" className="justify-between items-center mb-12">
                <Stack gap="2">
                    <Title level={1} gradient>{t.inventory.title}</Title>
                    <Text variant="muted" size="lg">
                        {t.inventory.subtitle}
                    </Text>
                </Stack>
                <Button className="shadow-lg hover-lift hover-glow" onClick={() => setShowCatalogModal(true)}>
                    <Plus className="inline mr-2" size={16} /> {t.inventory.addItem}
                </Button>
            </Stack>

            {/* Filter Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-neutral/90 backdrop-blur-xl rounded-2xl shadow-2xl flex overflow-hidden border border-primary/20" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, status: 'ACTIVE' }))}
                        className={`px-8 py-3 text-sm font-semibold transition-all duration-300 flex-1 ${filters.status === 'ACTIVE'
                            ? 'bg-primary text-white shadow-lg transform scale-105'
                            : 'text-base-content/60 hover:text-base-content/80 hover:bg-base-300/50'
                            }`}
                    >
                        {t.inventory.available}
                    </button>
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, status: 'LOCKED' }))}
                        className={`px-8 py-3 text-sm font-semibold transition-all duration-300 flex-1 ${filters.status === 'LOCKED'
                            ? 'bg-primary text-white shadow-lg transform scale-105'
                            : 'text-base-content/60 hover:text-base-content/80 hover:bg-base-300/50'
                            }`}
                    >
                        {t.inventory.listed}
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <Section className="bg-base-200 rounded-lg p-4 mb-8">
                <Title level={3} className="mb-4">{t.inventory.filters}</Title>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category/Type Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">{t.inventory.category}</label>
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
                        <label className="block text-sm font-medium mb-2">{t.inventory.search}</label>
                        <Input
                            placeholder={t.inventory.searchPlaceholder}
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
                </div>
            </Section>

            {/* Items Grid */}
            <Section>
                {isFetching && inventory ? (
                    // Loading state when filters change (similar to marketplace)
                    <div className="flex justify-center items-center py-12">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <Grid cols={4} gap="6">
                        {filteredItems.map((item: InventoryItemDto) => (
                            <InventoryItemCard
                                key={item.id}
                                item={item}
                                onClick={() => setSelectedItem({
                                    ...item,
                                    itemId: item.catalogItemId,
                                    itemType: item.itemType,
                                    viewCount: 0 // or whatever
                                })}
                            />
                        ))}
                    </Grid>
                ) : (
                    <EmptyState
                        icon={<Package className="text-8xl" />}
                        title={
                            filters.status === 'ACTIVE' ? t.inventory.noItemsAvailable :
                                t.inventory.noItemsListed
                        }
                        description={
                            filters.status === 'ACTIVE' ? t.inventory.availableDesc :
                                t.inventory.listedDesc
                        }
                        action={
                            filters.status === 'ACTIVE' ? (
                                <Button onClick={() => setShowCatalogModal(true)}>
                                    {t.inventory.exploreCatalog}
                                </Button>
                            ) : null
                        }
                    />
                )}
            </Section>

            {/* Catalog Modal */}
            <Modal isOpen={showCatalogModal} onClose={() => setShowCatalogModal(false)} title={t.inventory.addItemTitle} size="lg">
                <CatalogSelector onItemAdded={() => { refetch(); setShowCatalogModal(false); }} />
            </Modal>

            {/* Sell Item Modal */}
            <SellItemModal
                isOpen={!!sellingItem}
                onClose={() => setSellingItem(null)}
                item={sellingItem}
                onSuccess={() => {
                    handleSuccess();
                    alert(t.inventory.itemListed);
                }}
            />

            {/* Item Detail Modal */}
            <ItemDetailModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
                userInventory={inventory}
            />
        </Container>
    );
};
