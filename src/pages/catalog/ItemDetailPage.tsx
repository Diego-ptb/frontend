import { useParams } from 'react-router-dom';
import { useGetItemDetail } from '../../api/generated/catalog/catalog';
import { useGetPriceHistory, useGetSuggestedPrice } from '../../api/generated/marketplace/marketplace';
import { Container, Title, Button, Grid, Section, Stack, Text, Card, Stat } from '../../components/ui';
import { unescapeItemName } from '../../utils/string';
import { Gem, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ItemDetailPage = () => {
    const { t } = useLanguage();
    const { category, id } = useParams<{ category: string; id: string }>();

    const { data: item, isLoading } = useGetItemDetail(category || '', id || '', {
        query: { enabled: !!category && !!id },
    });

    const { data: priceHistory } = useGetPriceHistory(category || '', id || '', { limit: 10 }, {
        query: { enabled: !!category && !!id }
    });

    const { data: suggestedPrice } = useGetSuggestedPrice(category || '', id || '', {
        query: { enabled: !!category && !!id }
    });

    if (isLoading) {
        return (
            <Container className="py-12 text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </Container>
        );
    }

    if (!item) {
        return (
            <Container className="py-12 text-center">
                <Title level={2}>{t.catalog.itemNotFound}</Title>
            </Container>
        );
    }

    // Casting item to any because the schema for item detail response is generic object in api-docs
    const itemData = item as any;
    const historyData = (priceHistory as unknown as any[]) || [];
    const suggested = (suggestedPrice as any)?.price || 0;

    return (
        <Container className="py-8">
            <Grid cols={2} gap="8" className="lg:grid-cols-2">
                {/* Left Column: Image */}
                <Card className="h-fit sticky top-24">
                    <figure className="bg-gradient-to-br from-base-300 to-base-200 p-8 aspect-square flex items-center justify-center">
                        <img
                            src={itemData.image || 'https://placehold.co/600x600'}
                            alt={unescapeItemName(itemData.name)}
                            className="max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        />
                    </figure>
                </Card>

                {/* Right Column: Details */}
                <Stack gap="8">
                    <Stack gap="4">
                        <Title level={1} gradient>{unescapeItemName(itemData.name)}</Title>
                        <div className="text-text-muted text-lg" dangerouslySetInnerHTML={{ __html: itemData.description || t.catalog.noDescription }} />

                        <Stack direction="row" gap="4" className="items-center mt-4">
                            <Text className="text-4xl font-black text-primary">${itemData.price}</Text>
                            {suggested > 0 && (
                                <div className="badge badge-outline badge-lg">
                                    {t.catalog.suggestedPrice} ${suggested}
                                </div>
                            )}
                        </Stack>

                        <Button size="lg" className="mt-4 shadow-glow-primary">
                            {t.catalog.addToInventory}
                        </Button>
                    </Stack>

                    {/* Stats Grid */}
                    <Grid cols={2} gap="4">
                        <Stat title={t.catalog.rarity} value={itemData.rarity?.name || t.catalog.common} figure={<Gem />} />
                        <Stat title={t.catalog.type} value={itemData.type || category} figure={<MapPin />} />
                    </Grid>

                    {/* Price History */}
                    <Section>
                        <Title level={3} className="mb-4">{t.catalog.priceHistory}</Title>
                        {historyData.length > 0 ? (
                            <div className="w-full h-48 flex items-end gap-2 p-4 bg-base-200/50 rounded-xl border border-white/5">
                                {historyData.map((point: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex-1 bg-accent hover:bg-accent-focus transition-colors rounded-t-sm relative group"
                                        style={{ height: `${(point.price / Math.max(...historyData.map((p: any) => p.price))) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            ${point.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Text variant="muted">{t.catalog.noHistory}</Text>
                        )}
                    </Section>
                </Stack>
            </Grid>
        </Container>
    );
};
