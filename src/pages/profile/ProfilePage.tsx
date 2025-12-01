import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Title, Stack, Section, Text, Button, Card, CardBody, AvatarImage } from '../../components/ui';
import { useGetCurrentUser, useUpdateProfile, useUploadProfileImage } from '../../api/generated/users/users';
import { toast } from 'react-hot-toast';
import { useTheme, type Theme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { type Language } from '../../constants/i18n';

export const ProfilePage = () => {
    const { data: user, refetch, isLoading } = useGetCurrentUser();
    const { mutate: updateProfile } = useUpdateProfile();
    const { theme, setTheme } = useTheme();
    const { t, language, setLanguage } = useLanguage();

    const [imageUrl, setImageUrl] = useState('');
    const [tradeEnabled, setTradeEnabled] = useState(true);


    useEffect(() => {
        if (user) {
            setImageUrl(user.image || '');
            // If user has a saved theme, apply it
            if (user.theme) {
                setTheme(user.theme as Theme);
            }
            // setTradeEnabled(user.tradeEnabled ?? true);
        }
    }, [user, setTheme]);

    const handleUpdate = () => {
        if (!user?.username) return;

        updateProfile({
            data: {
                image: imageUrl,
                theme,
                tradeEnabled
            }
        }, {
            onSuccess: () => {
                toast.success(t.profile.updateSuccess);
                refetch();
            },
            onError: () => toast.error(t.profile.updateError)
        });
    };

    const { mutate: uploadImage, isPending: isUploading } = useUploadProfileImage();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        uploadImage({
            data: { file }
        }, {
            onSuccess: (updatedUser: any) => {
                toast.success(t.profile.imageUploadSuccess);
                if (updatedUser.image) {
                    setImageUrl(updatedUser.image);
                }
                refetch();
            },
            onError: (error: any) => {
                toast.error(error.message || t.profile.imageUploadError);
            }
        });
    };

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
            <Stack gap="8" className="max-w-2xl mx-auto">
                <Stack gap="2">
                    <Title level={1} gradient>{t.profile.title}</Title>
                    <Text variant="muted">{t.profile.subtitle}</Text>
                </Stack>

                <Section>
                    <Card>
                        <CardBody>
                            <Stack gap="6">
                                {/* Avatar Section */}
                                <Stack gap="4" className="items-center">
                                    <AvatarImage
                                        src={imageUrl}
                                        alt="Profile"
                                        size="lg"
                                        ring
                                        username={user?.username}
                                        className="w-24"
                                    />
                                    <Stack gap="2" className="w-full items-center">
                                        <Text className="font-bold">{t.profile.profilePicture}</Text>
                                        <div className="form-control w-full max-w-xs">
                                            <input
                                                type="file"
                                                className="file-input file-input-bordered w-full max-w-xs"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={isUploading}
                                            />
                                            <label className="label">
                                                <span className="label-text-alt text-text-muted">
                                                    {isUploading ? t.common.uploading : t.profile.uploadNewAvatar}
                                                </span>
                                            </label>
                                        </div>
                                    </Stack>
                                </Stack>

                                {/* Balance Section */}
                                <Stack gap="4">
                                    <Stack gap="2">
                                        <Text className="font-bold">{t.profile.accountBalance}</Text>
                                        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                                            <div>
                                                <Text className="text-2xl font-bold text-primary">${user?.balance?.toFixed(2) || '0.00'}</Text>
                                                <Text variant="muted" size="sm">{t.profile.availableFunds}</Text>
                                            </div>
                                            <Link to="/recharge">
                                                <Button variant="primary" size="sm">
                                                    {t.profile.addFunds}
                                                </Button>
                                            </Link>
                                        </div>
                                    </Stack>
                                </Stack>

                                {/* Settings Section */}
                                <Stack gap="4">
                                    <Stack gap="2">
                                        <Text className="font-bold">Language</Text>
                                        <select
                                            className="select select-bordered w-full bg-base-200"
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value as Language)}
                                        >
                                            <option value="EN">English</option>
                                            <option value="ES">Español</option>
                                        </select>
                                    </Stack>

                                    <Stack gap="2">
                                        <Text className="font-bold">{t.profile.themePreference}</Text>
                                        <select
                                            className="select select-bordered w-full bg-base-200"
                                            value={theme}
                                            onChange={(e) => {
                                                const newTheme = e.target.value as Theme;
                                                setTheme(newTheme);
                                                if (user?.username) {
                                                    updateProfile({
                                                        data: { theme: newTheme }
                                                    }, {
                                                        onSuccess: () => {
                                                            toast.success(t.profile.themeUpdateSuccess);
                                                            refetch();
                                                        },
                                                        onError: () => toast.error(t.profile.themeUpdateError)
                                                    });
                                                }
                                            }}
                                        >
                                            <option value="dark">{t.profile.darkTheme}</option>
                                            <option value="light">{t.profile.lightTheme}</option>
                                        </select>
                                    </Stack>

                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-start gap-4">
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={tradeEnabled}
                                                onChange={(e) => setTradeEnabled(e.target.checked)}
                                            />
                                            <span className="label-text font-bold">{t.profile.enableTrading}</span>
                                        </label>
                                        <Text variant="muted" size="sm" className="mt-1">
                                            {t.profile.enableTradingDesc}
                                        </Text>
                                    </div>
                                </Stack>

                                <Button onClick={handleUpdate} fullWidth size="lg" className="mt-4">
                                    {t.profile.saveChanges}
                                </Button>
                            </Stack>
                        </CardBody>
                    </Card>
                </Section>
            </Stack>
        </Container>
    );
};
