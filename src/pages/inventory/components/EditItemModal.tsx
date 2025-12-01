import React, { useEffect, useState } from 'react';
import { Modal, Stack, Button, Label, Input } from '../../../components/ui';
import { useUpdateItem } from '../../../api/generated/inventory/inventory';
import { type InventoryItemDto } from '../../../api/generated/model';
import { unescapeItemName } from '../../../utils/string';

interface EditItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItemDto | null;
    onSuccess: () => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, item, onSuccess }) => {
    const { mutate: updateItem, isPending } = useUpdateItem();

    const [wearValue, setWearValue] = useState<number>(0);
    const [stattrak, setStattrak] = useState<boolean>(false);
    const [souvenir, setSouvenir] = useState<boolean>(false);

    useEffect(() => {
        if (item) {
            setWearValue(item.wearValue || 0);
            setStattrak(item.stattrak || false);
            setSouvenir(item.souvenir || false);
        }
    }, [item]);

    const handleSave = () => {
        if (!item?.id) return;

        updateItem({
            itemId: item.id,
            data: {
                wearValue,
                stattrak,
                souvenir
            }
        }, {
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            onError: () => {
                alert('Failed to update item');
            }
        });
    };

    if (!item) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${unescapeItemName(item.itemName)}`}>
            <Stack gap="4">
                <div>
                    <Label>Wear Value (Float)</Label>
                    <Input
                        type="number"
                        step="0.00000000000001"
                        value={wearValue}
                        onChange={(e) => setWearValue(parseFloat(e.target.value))}
                        fullWidth
                    />
                </div>

                <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4">
                        <span className="label-text font-medium">StatTrak™</span>
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={stattrak}
                            onChange={(e) => setStattrak(e.target.checked)}
                        />
                    </label>
                </div>

                <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4">
                        <span className="label-text font-medium">Souvenir</span>
                        <input
                            type="checkbox"
                            className="checkbox checkbox-secondary"
                            checked={souvenir}
                            onChange={(e) => setSouvenir(e.target.checked)}
                        />
                    </label>
                </div>

                <Stack direction="row" gap="2" className="mt-4">
                    <Button variant="outline" onClick={onClose} fullWidth>Cancel</Button>
                    <Button onClick={handleSave} loading={isPending} fullWidth>Save Changes</Button>
                </Stack>
            </Stack>
        </Modal>
    );
};
