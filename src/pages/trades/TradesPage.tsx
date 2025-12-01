import { useState } from 'react';
import { useGetUserTrades } from '../../api/generated/trades/trades';
import { useGetAvailableTraders } from '../../api/generated/users/users';
import { Container, Title, Grid, Section, Stack, Text, EmptyState, Button, Card, CardBody, AvatarItem } from '../../components/ui';
import { TradeCard } from './components/TradeCard';
import { TradeModal } from './components/TradeModal';
import { useLanguage } from '../../context/LanguageContext';
import { Users, ArrowRightLeft } from 'lucide-react';

export const TradesPage = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'find' | 'active'>('find');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const currentUserId = localStorage.getItem('userId') || '';

    // Fetch users for "Find Traders"
    const { data: users, isLoading: isLoadingUsers } = useGetAvailableTraders({
        page: 0,
        size: 20
    });

    // Fetch active trades
    const { data: trades, isLoading: isLoadingTrades } = useGetUserTrades(currentUserId, undefined, {
        query: { enabled: !!currentUserId }
    });

    const handleStartTrade = (user: any) => {
        setSelectedUser(user);
        setIsTradeModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsTradeModalOpen(false);
        setSelectedUser(null);
    };

    // Filter out current user from traders list
    const traders = users?.content?.filter((u: any) => u.id !== currentUserId) || [];

    return (
        <Container className="py-8">
            <Stack gap="8">
                <Stack gap="2">
                    <Title level={1} gradient>{t.trades.title}</Title>
                    <Text variant="muted">{t.trades.subtitle}</Text>
                </Stack>

                <Section>
                    <Stack direction="row" className="justify-between items-center mb-4">
                        <Title level={2}>{activeTab === 'find' ? t.trades.findTraders : t.trades.activeTrades}</Title>
                        <div className="flex gap-2">
                            <Button
                                variant={activeTab === 'find' ? 'primary' : 'ghost'}
                                onClick={() => setActiveTab('find')}
                            >
                                {t.trades.findTraders}
                            </Button>
                            <Button
                                variant={activeTab === 'active' ? 'primary' : 'ghost'}
                                onClick={() => setActiveTab('active')}
                            >
                                {t.trades.activeTrades}
                            </Button>
                        </div>
                    </Stack>

                    {activeTab === 'find' ? (
                        isLoadingUsers ? (
                            <div className="flex justify-center py-12">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : traders.length > 0 ? (
                            <Grid cols={3} gap="6">
                                {traders.map((user: any) => (
                                    <Card key={user.id}>
                                        <CardBody>
                                            <Stack gap="4" className="items-center text-center">
                                                <AvatarItem user={user} size="lg" />
                                                <Stack gap="2">
                                                    <Text className="font-bold text-lg">{user.username}</Text>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleStartTrade(user)}
                                                    >
                                                        Trade
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </CardBody>
                                    </Card>
                                ))}
                            </Grid>
                        ) : (
                            <EmptyState
                                icon={<Users className="text-8xl" />}
                                title={t.trades.noTraders}
                                description={t.trades.noTradersDesc}
                            />
                        )
                    ) : (
                        isLoadingTrades ? (
                            <div className="flex justify-center py-12">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : trades?.content?.length ? (
                            <Grid cols={2} gap="6">
                                {trades.content.map((trade: any) => (
                                    <TradeCard key={trade.id} trade={trade} currentUserId={currentUserId} />
                                ))}
                            </Grid>
                        ) : (
                            <EmptyState
                                icon={<ArrowRightLeft className="text-8xl" />}
                                title={t.trades.noActiveTrades}
                                description={t.trades.noActiveTradesDesc}
                                action={
                                    <Button onClick={() => setActiveTab('find')}>
                                        {t.trades.findTradersTitle}
                                    </Button>
                                }
                            />
                        )
                    )}
                </Section>
            </Stack>

            <TradeModal
                isOpen={isTradeModalOpen}
                onClose={handleCloseModal}
                targetUser={selectedUser}
            />
        </Container>
    );
};
