import React from 'react';
import { Modal, Stack, Button, Badge, AvatarItem } from '../../../components/ui';
import { type UserProfileDto } from '../../../api/generated/model';

interface TraderModalProps {
    isOpen: boolean;
    onClose: () => void;
    trader: UserProfileDto | null;
}

export const TraderModal: React.FC<TraderModalProps> = ({ isOpen, onClose, trader }) => {
    if (!trader) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Trader Profile">
            <Stack gap="6">
                <div className="flex gap-6">
                    <div className="flex-shrink-0">
                        <AvatarItem user={trader} size="lg" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">{trader.username}</h2>
                        <div className="space-y-2">
                            <Badge variant="success" outline>Trading Enabled</Badge>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose} variant="outline">Close</Button>
                    <Button onClick={() => window.open(`/users/${trader.username}`, '_blank')}>View Full Profile</Button>
                </div>
            </Stack>
        </Modal>
    );
};