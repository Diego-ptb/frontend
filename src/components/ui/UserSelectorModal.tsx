import React, { useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getAvailableTraders } from '../../api/generated/users/users';
import { Modal, Input, AvatarItem, Button, Text, Stack } from './index';
import { type UserProfileDto } from '../../api/generated/model';
import { useInView } from 'react-intersection-observer';

interface UserSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserSelect: (user: UserProfileDto) => void;
    title?: string;
}

export const UserSelectorModal: React.FC<UserSelectorModalProps> = ({
    isOpen,
    onClose,
    onUserSelect,
    title = "Select User"
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { ref, inView } = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['available-traders', searchQuery],
        queryFn: ({ pageParam = 0 }) =>
            getAvailableTraders({ page: pageParam, size: 20, search: searchQuery || undefined }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined;
            return (lastPage.number || 0) + 1;
        },
        enabled: isOpen,
    });

    // Flatten all pages
    const allUsers = useMemo(() => {
        return data?.pages.flatMap(page => page.content || []) || [];
    }, [data]);

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleUserClick = (user: UserProfileDto) => {
        onUserSelect(user);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
            <Stack gap="4">
                <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="max-h-96 overflow-y-auto">
                    {status === 'pending' ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : status === 'error' ? (
                        <Text variant="muted" className="text-center py-8">
                            Error loading users
                        </Text>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {allUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex flex-col items-center p-4 border border-base-300 rounded-lg hover:border-primary cursor-pointer transition-colors"
                                    onClick={() => handleUserClick(user)}
                                >
                                    <AvatarItem user={user} size="md" />
                                    <Text className="mt-2 text-center font-medium">
                                        {user.username}
                                    </Text>
                                </div>
                            ))}
                            {hasNextPage && (
                                <div ref={ref} className="col-span-full flex justify-center py-4">
                                    {isFetchingNextPage && (
                                        <span className="loading loading-spinner loading-md"></span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <Button onClick={onClose} variant="outline">
                        Cancel
                    </Button>
                </div>
            </Stack>
        </Modal>
    );
};