import type { Trade, TradeOffer } from '../../../api/generated/model';
import { useAcceptTrade, useDeclineTrade } from '../../../api/generated/trades/trades';
import { Card, CardBody, Stack, Text, Button, Badge } from '../../../components/ui';
import { toast } from 'react-hot-toast';
import { unescapeItemName } from '../../../utils/string';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../../../context/LanguageContext';

interface TradeCardProps {
    trade: Trade;
    currentUserId: string;
    onUpdate?: () => void;
}

export const TradeCard = ({ trade, currentUserId, onUpdate }: TradeCardProps) => {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const { mutate: acceptTrade, isPending: isAccepting } = useAcceptTrade();
    const { mutate: declineTrade, isPending: isDeclining } = useDeclineTrade();

    const isInitiator = trade.initiator?.id === currentUserId;
    const partner = isInitiator ? trade.target : trade.initiator;
    const isPending = trade.status === 'PENDING';
    const canAction = !isInitiator && isPending;

    const myOffers = trade.offers?.filter(o => o.user?.id === currentUserId) || [];
    const partnerOffers = trade.offers?.filter(o => o.user?.id !== currentUserId) || [];

    const handleAccept = () => {
        if (!trade.id) return;
        acceptTrade({ tradeId: trade.id, params: { userId: currentUserId } }, {
            onSuccess: () => {
                toast.success(t.trades.tradeAccepted);
                queryClient.invalidateQueries({ queryKey: ['inventory', currentUserId], refetchType: 'active' });
                onUpdate?.();
            },
            onError: () => toast.error(t.trades.acceptError)
        });
    };

    const handleDecline = () => {
        if (!trade.id) return;
        declineTrade({ tradeId: trade.id, params: { userId: currentUserId } }, {
            onSuccess: () => {
                toast.success(t.trades.tradeDeclined);
                queryClient.invalidateQueries({ queryKey: ['inventory', currentUserId], refetchType: 'active' });
                onUpdate?.();
            },
            onError: () => toast.error(t.trades.declineError)
        });
    };

    const renderOfferItem = (offer: TradeOffer) => {
        if (offer.inventoryItem) {
            return (
                <div key={offer.id} className="flex items-center gap-2 bg-base-200 p-2 rounded-lg">
                    <img
                        src={offer.inventoryItem.skin?.image || 'https://placehold.co/50x50'}
                        alt={unescapeItemName(offer.inventoryItem.skin?.name)}
                        className="w-10 h-10 object-contain"
                    />
                    <div className="overflow-hidden">
                        <Text className="text-sm font-bold truncate">{unescapeItemName(offer.inventoryItem.skin?.name)}</Text>
                        <Text className="text-xs text-muted truncate">{offer.inventoryItem.skin?.rarity?.name}</Text>
                    </div>
                </div>
            );
        }
        if (offer.offeredMoney) {
            return (
                <div key={offer.id} className="flex items-center gap-2 bg-base-200 p-2 rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center bg-green-500/20 text-green-500 rounded-full">
                        $
                    </div>
                    <Text className="font-bold">${offer.offeredMoney}</Text>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="border border-base-300">
            <CardBody>
                <Stack gap="4">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                    {partner?.image ? (
                                        <img src={partner.image} alt={partner.username} />
                                    ) : (
                                        <span>{partner?.username?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Text className="font-bold">{t.trades.tradeWith.replace('{username}', partner?.username || '')}</Text>
                                <Text variant="muted" size="sm">{new Date(trade.createdAt || '').toLocaleDateString()}</Text>
                            </div>
                        </div>
                        <Badge variant={
                            trade.status === 'ACCEPTED' ? 'success' :
                                trade.status === 'DECLINED' ? 'error' : 'warning'
                        }>
                            {trade.status}
                        </Badge>
                    </div>

                    {/* Trade Content */}
                    <div className="grid grid-cols-2 gap-4 relative">
                        {/* My Side */}
                        <div className="bg-base-200/50 p-3 rounded-xl">
                            <Text className="font-bold mb-2 text-center text-sm uppercase tracking-wider text-muted">{t.trades.youGive}</Text>
                            <Stack gap="2">
                                {myOffers.length > 0 ? myOffers.map(renderOfferItem) : <Text variant="muted" size="sm" className="text-center italic">{t.trades.nothing}</Text>}
                            </Stack>
                        </div>

                        {/* Exchange Icon */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 p-2 rounded-full border border-base-300 shadow-lg z-10">
                            🔄
                        </div>

                        {/* Partner Side */}
                        <div className="bg-base-200/50 p-3 rounded-xl">
                            <Text className="font-bold mb-2 text-center text-sm uppercase tracking-wider text-muted">{t.trades.theyGive}</Text>
                            <Stack gap="2">
                                {partnerOffers.length > 0 ? partnerOffers.map(renderOfferItem) : <Text variant="muted" size="sm" className="text-center italic">{t.trades.nothing}</Text>}
                            </Stack>
                        </div>
                    </div>

                    {/* Actions */}
                    {canAction && (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <Button
                                variant="outline"
                                color="error"
                                onClick={handleDecline}
                                disabled={isDeclining || isAccepting}
                            >
                                {isDeclining ? t.trades.declining : t.trades.decline}
                            </Button>
                            <Button
                                variant="primary"
                                color="success"
                                onClick={handleAccept}
                                disabled={isDeclining || isAccepting}
                            >
                                {isAccepting ? t.trades.accepting : t.trades.accept}
                            </Button>
                        </div>
                    )}
                </Stack>
            </CardBody>
        </Card>
    );
};
