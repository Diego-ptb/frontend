import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Button, Card, CardBody, Stack, Text } from '../../components/ui';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { useLanguage } from '../../context/LanguageContext';

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const { t } = useLanguage();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center py-12">
            <Container className="w-full max-w-md">
                <Stack gap="8">
                    <Stack gap="4" className="text-center">
                        <Title level={1} gradient>SkinTrades</Title>
                        <Title level={2}>{isLogin ? t.auth.welcomeBack : t.auth.join}</Title>
                        <Text variant="muted">
                            {isLogin ? t.auth.signInDesc : t.auth.createAccountDesc}
                        </Text>
                    </Stack>

                    <Card>
                        <CardBody>
                            {isLogin ? <LoginForm /> : <RegisterForm />}

                            <Stack gap="4" className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-base-content/20" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-base-100 text-base-content px-4 py-1 rounded-full border border-base-content/20 font-medium">{t.auth.or}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    fullWidth
                                    onClick={() => setIsLogin(!isLogin)}
                                >
                                    {isLogin ? t.auth.createNewAccount : t.auth.signInExisting}
                                </Button>
                            </Stack>
                        </CardBody>
                    </Card>

                    <Text variant="muted" size="sm" className="text-center">
                        {t.auth.terms}
                    </Text>
                </Stack>
            </Container>
        </div>
    );
};
