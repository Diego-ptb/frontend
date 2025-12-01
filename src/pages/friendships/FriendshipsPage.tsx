import { useState } from 'react';
import { Container, Title, Grid, Section, Stack, Text, EmptyState, Button, Input } from '../../components/ui';
import { useGetFriends, useGetPendingRequests, useSendFriendRequest, useAcceptFriendRequest, useDeclineFriendRequest } from '../../api/generated/friendships/friendships';
import { Users, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { AvatarItem } from '../../components/ui';

export const FriendshipsPage = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'friends' | 'pending'>('friends');
    const [userIdToAdd, setUserIdToAdd] = useState('');
    const currentUserId = localStorage.getItem('userId') || '';

    const { data: friends, refetch: refetchFriends, isLoading: isLoadingFriends } = useGetFriends({ userId: currentUserId }, {
        query: { enabled: !!currentUserId }
    });

    const { data: pendingRequests, refetch: refetchPending, isLoading: isLoadingPending } = useGetPendingRequests({ userId: currentUserId }, {
        query: { enabled: !!currentUserId }
    });

    const { mutate: sendRequest, isPending: isSending } = useSendFriendRequest();
    const { mutate: acceptRequest } = useAcceptFriendRequest();
    const { mutate: declineRequest } = useDeclineFriendRequest();

    const handleSendRequest = () => {
        if (!userIdToAdd.trim()) return;

        sendRequest({ data: { friendId: userIdToAdd } }, {
            onSuccess: () => {
                toast.success(t.friendships.requestSent);
                setUserIdToAdd('');
            },
            onError: () => {
                toast.error(t.friendships.requestFailed);
            }
        });
    };

    const handleRespond = (requestId: string, accept: boolean) => {
        if (accept) {
            acceptRequest({ id: requestId, params: { userId: currentUserId } }, {
                onSuccess: () => {
                    toast.success(t.friendships.requestAccepted);
                    refetchPending();
                    refetchFriends();
                }
            });
        } else {
            declineRequest({ id: requestId, params: { userId: currentUserId } }, {
                onSuccess: () => {
                    toast.success(t.friendships.requestDeclined);
                    refetchPending();
                }
            });
        }
    };

    const friendsList = friends || [];
    const pendingList = pendingRequests || [];

    return (
        <Container className="py-8">
            <Stack gap="8">
                <Stack gap="2">
                    <Title level={1} gradient>{t.friendships.title}</Title>
                    <Text variant="muted">{t.friendships.subtitle}</Text>
                </Stack>

                {/* Add Friend Section */}
                <Section className="bg-base-200 rounded-lg p-6">
                    <Title level={3} className="mb-4">{t.friendships.addFriend}</Title>
                    <div className="flex gap-4">
                        <Input
                            placeholder={t.friendships.enterUserId}
                            value={userIdToAdd}
                            onChange={(e) => setUserIdToAdd(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSendRequest}
                            disabled={isSending || !userIdToAdd.trim()}
                            className="min-w-[120px]"
                        >
                            {isSending ? <span className="loading loading-spinner loading-sm"></span> : t.friendships.sendRequest}
                        </Button>
                    </div>
                </Section>

                <Section>
                    <Stack direction="row" className="justify-between items-center mb-4">
                        <Title level={2}>{activeTab === 'friends' ? t.friendships.myFriends : t.friendships.pendingRequests}</Title>
                        <div className="flex gap-2">
                            <Button
                                variant={activeTab === 'friends' ? 'primary' : 'ghost'}
                                onClick={() => setActiveTab('friends')}
                            >
                                {t.friendships.myFriends}
                            </Button>
                            <Button
                                variant={activeTab === 'pending' ? 'primary' : 'ghost'}
                                onClick={() => setActiveTab('pending')}
                            >
                                {t.friendships.pendingRequests}
                                {pendingList.length > 0 && (
                                    <span className="ml-2 badge badge-secondary badge-sm">{pendingList.length}</span>
                                )}
                            </Button>
                        </div>
                    </Stack>

                    {activeTab === 'pending' ? (
                        isLoadingPending ? (
                            <div className="flex justify-center py-12">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : pendingList.length > 0 ? (
                            <Grid cols={1} gap="4">
                                {pendingList.map((request: any) => (
                                    <div key={request.id} className="bg-base-100 p-4 rounded-lg shadow flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <AvatarItem
                                                user={{
                                                    id: request.friendId,
                                                    username: request.friendUsername,
                                                    image: request.friendImage
                                                }}
                                                size="md"
                                            />
                                            <div>
                                                <h3 className="font-bold">{request.friendUsername || t.friendships.unknownUser}</h3>
                                                <p className="text-sm text-base-content/70">{t.friendships.wantsToBeFriend}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => handleRespond(request.id, true)}
                                            >
                                                {t.friendships.accept}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleRespond(request.id, false)}
                                            >
                                                {t.friendships.decline}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </Grid>
                        ) : (
                            <EmptyState
                                icon={<UserPlus className="text-8xl" />}
                                title={t.friendships.noPending}
                                description=""
                            />
                        )
                    ) : (
                        isLoadingFriends ? (
                            <div className="flex justify-center py-12">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : friendsList.length > 0 ? (
                            <Grid cols={3} gap="6">
                                {friendsList.map((friendship: any) => {
                                    return (
                                        <div key={friendship.id} className="bg-base-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-base-200">
                                            <div className="flex flex-col items-center text-center gap-4">
                                                <AvatarItem
                                                    user={{
                                                        id: friendship.friendId,
                                                        username: friendship.friendUsername,
                                                        image: friendship.friendImage
                                                    }}
                                                    size="lg"
                                                    className="w-20 h-20"
                                                />
                                                <div>
                                                    <h3 className="font-bold text-lg">{friendship.friendUsername || t.friendships.unknownUser}</h3>
                                                    <p className="text-sm text-base-content/70">{t.friendships.friend}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => window.location.href = `/users/${friendship.friendId}`}
                                                >
                                                    {t.users.viewProfile}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Grid>
                        ) : (
                            <EmptyState
                                icon={<Users className="text-8xl" />}
                                title={t.friendships.noFriends}
                                description=""
                            />
                        )
                    )}
                </Section>
            </Stack>
        </Container>
    );
};
