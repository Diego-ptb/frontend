import React from 'react';
import { Modal, Button, Stack, Text } from '../../../components/ui';
import { useLanguage } from '../../../context/LanguageContext';

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetUser: any;
}

export const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, targetUser }) => {
    const { t } = useLanguage();

    if (!targetUser) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.trades.tradeWith.replace('{username}', targetUser.username)}>
            <Stack gap="4">
                <Text>{t.trades.comingSoon}</Text>
                <div className="flex justify-end">
                    <Button onClick={onClose}>{t.trades.close}</Button>
                </div>
            </Stack>
        </Modal>
    );
};
