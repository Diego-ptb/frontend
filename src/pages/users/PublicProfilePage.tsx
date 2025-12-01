import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserByUsername } from '../../api/generated/users/users';
import { useGetUserInventory } from '../../api/generated/inventory/inventory';
import { useGetUserListings } from '../../api/generated/marketplace/marketplace';
import { Container, Title, Stack, Section, Text, Button, Grid, Card, CardBody } from '../../components/ui';
import { InventoryItemCard } from '../inventory/components/InventoryItemCard';
import { ListingCard } from '../marketplace/components/ListingCard';
import { type InventoryItemDto, type ListingDto } from '../../api/generated/model';
import { getAvatarUrl } from '../../utils/avatar';
import { AvatarImage } from '../../components/ui';
import { useLanguage } from '../../context/LanguageContext';

export const PublicProfilePage = () => {
    const { t } = useLanguage();
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userId');

    const { data: user, isLoading: isLoadingUser } = useGetUserByUsername(username || '', {
        query: { enabled: !!username }
    });

    const { data: inventory, isLoading: isLoadingInventory } = useGetUserInventory(user?.id || '', undefined, {
        query: { enabled: !!user?.id }
    });

    const { data: listings, isLoading: isLoadingListings } = useGetUserListings(user?.id || '', undefined, {
        query: { enabled: !!user?.id }
    });

    // Filter out inventory items that are currently listed for sale
    const availableInventory = inventory?.content?.filter(item => item.status !== 'LISTED') || [];

    const handleTrade = () => {
        if (!user?.id) return;
        navigate(`/trades/new/${user.id}`);
    };

    if (!user && !username) return null;

    const isLoading = isLoadingUser || (user && (isLoadingInventory || isLoadingListings));

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
            <Stack gap="8">
                {/* Profile Header */}
                <Section>
                    <Card className="bg-gradient-to-r from-dark-elevated to-dark-surface border-none">
                        <CardBody>
                            <Stack direction="row" className="items-center gap-6">
                                <AvatarImage
                                    src={getAvatarUrl(user?.image, user?.username || username)}
                                    alt={user?.username || username}
                                    size="lg"
                                    ring
                                    className="w-24"
                                />
                                {isLoadingUser ? (
                                    <div className="flex-1">
                                        <div className="skeleton h-8 w-48 mb-2"></div>
                                        <div className="skeleton h-4 w-32"></div>
                                    </div>
                                ) : (
                                    <Stack gap="2" className="flex-1">
                                        <Title level={1}>{user?.username || username}</Title>
                                        <Text variant="muted">{t.users.memberSince} {new Date().getFullYear()}</Text>
                                        {/* We don't have join date in UserProfileDto yet */}
                                    </Stack>
                                )}
                                {currentUserId && currentUserId !== user?.id && !isLoadingUser && (
                                    <Button onClick={handleTrade} size="lg" className="shadow-glow-purple">
                                        ⇄ {t.users.trade}
                                    </Button>
                                )}
                            </Stack>
                        </CardBody>
                    </Card>
                </Section>

                {/* Inventory Section */}
                <Section>
                    <Title level={2} className="mb-4">{t.users.inventory}</Title>
                    {availableInventory.length === 0 ? (
                        <Text variant="muted">{t.users.noItems}</Text>
                    ) : (
                        <Grid cols={4} gap="6">
                            {availableInventory.map((item: InventoryItemDto) => (
                                <InventoryItemCard
                                    key={item.id}
                                    item={item}
                                    onClick={() => { }} // Read-only
                                />
                            ))}
                        </Grid>
                    )}
                </Section>

                {/* Listings Section */}
                <Section>
                    <Title level={2} className="mb-4">{t.users.activeListings}</Title>
                    {listings?.content?.length === 0 ? (
                        <Text variant="muted">{t.users.noListings}</Text>
                    ) : (
                        <Grid cols={4} gap="6">
                            {listings?.content?.map((listing: ListingDto) => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    onClick={() => navigate('/marketplace')} // Redirect to marketplace to buy
                                    isOwner={false}
                                />
                            ))}
                        </Grid>
                    )}
                </Section>
            </Stack>
        </Container>
    );
};
