import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRechargeBalance } from '../../api/generated/users/users';
import { useQueryClient } from '@tanstack/react-query';
import { Container, Section, Title, Text, Button } from '../../components/ui';
import { toast } from 'react-hot-toast';
import { CreditCard, DollarSign, Eye, EyeOff } from 'lucide-react';

export const RechargeBalancePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        amount: '',
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: '',
    });

    const [showCVV, setShowCVV] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { mutate: rechargeBalance, isPending } = useRechargeBalance({
        mutation: {
            onSuccess: () => {
                setIsProcessing(false);
                setShowSuccess(true);
                toast.success('Balance recharged successfully!');
                queryClient.invalidateQueries({ queryKey: ['getCurrentUser'] });
                window.dispatchEvent(new Event('balance-changed'));
                setTimeout(() => {
                    setShowSuccess(false);
                    navigate('/profile');
                }, 3000);
            },
            onError: () => {
                setIsProcessing(false);
                toast.error('Failed to recharge balance. Please check your card details.');
            },
        },
    });

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        if (field === 'cardNumber') {
            value = value.replace(/\s/g, '').slice(0, 16);
            value = value.replace(/(\d{4})/g, '$1 ').trim();
        }

        if (field === 'expiryDate') {
            value = value.replace(/\D/g, '').slice(0, 4);
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
        }

        if (field === 'cvv') {
            value = value.replace(/\D/g, '').slice(0, 4);
        }

        if (field === 'amount') {
            value = value.replace(/[^\d.]/g, '');
        }

        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setIsProcessing(true);

        rechargeBalance({
            data: {
                amount,
                cardNumber: formData.cardNumber || undefined,
                cardHolderName: formData.cardHolderName || undefined,
                expiryDate: formData.expiryDate || undefined,
                cvv: formData.cvv || undefined,
            },
        });
    };

    const getCardBrand = () => {
        const first = formData.cardNumber.replace(/\s/g, '')[0];
        if (first === '4') return 'Visa';
        if (first === '5') return 'Mastercard';
        if (first === '3') return 'Amex';
        return 'Card';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 via-primary/5 to-accent/5 dark:from-base-200 dark:via-primary/10 dark:to-accent/10 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <Container className="relative z-10 w-full max-w-6xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left side - Card preview */}
                    <div className="flex justify-center order-2 md:order-1">
                        <div className="w-full max-w-sm h-64 bg-gradient-to-br from-primary via-accent to-secondary rounded-3xl p-8 text-white shadow-2xl transform transition-transform duration-300 hover:scale-105">
                            <div className="flex justify-between items-start mb-12">
                                <div className="text-3xl font-bold">💳</div>
                                <span className="text-sm font-semibold">{getCardBrand()}</span>
                            </div>

                            <div className="mb-8">
                                <div className="text-xs text-white/60 mb-2">CARD NUMBER</div>
                                <div className="text-2xl tracking-widest font-light">
                                    {formData.cardNumber || '**** **** **** ****'}
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs text-white/60 mb-1">CARD HOLDER</div>
                                    <div className="text-lg font-semibold">
                                        {formData.cardHolderName || 'Your Name'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-white/60 mb-1">EXPIRES</div>
                                    <div className="text-lg font-semibold">
                                        {formData.expiryDate || 'MM/YY'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="order-1 md:order-2">
                        <Section className="bg-base-100/80 dark:bg-base-200/80 backdrop-blur-md rounded-2xl p-8 border border-base-300 dark:border-base-content/10 shadow-2xl">
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <DollarSign className="w-8 h-8 text-primary" />
                                    <Title level={1} className="text-3xl">Recargar Saldo</Title>
                                </div>
                                <Text className="text-base-content/70">Agrega fondos a tu cuenta para comprar en el marketplace</Text>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-semibold text-base-content mb-3">Monto ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-4 text-base-content/50 text-lg">$</span>
                                        <input
                                            type="text"
                                            value={formData.amount}
                                            onChange={handleInputChange('amount')}
                                            placeholder="0.00"
                                            className="w-full bg-base-100 dark:bg-base-200 border border-base-300 dark:border-base-content/10 rounded-xl pl-8 pr-4 py-3 text-base-content placeholder-base-content/50 focus:outline-none focus:border-primary focus:bg-base-50 dark:focus:bg-base-100 transition text-lg font-semibold"
                                        />
                                    </div>
                                </div>

                                {/* Card Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-base-content mb-3">Número de Tarjeta</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-base-content/50" />
                                        <input
                                            type="text"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange('cardNumber')}
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full bg-base-100 dark:bg-base-200 border border-base-300 dark:border-base-content/10 rounded-xl pl-12 pr-4 py-3 text-base-content placeholder-base-content/50 focus:outline-none focus:border-primary focus:bg-base-50 dark:focus:bg-base-100 transition font-mono tracking-wider"
                                        />
                                    </div>
                                </div>

                                {/* Card Holder Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-base-content mb-3">Titular de la Tarjeta</label>
                                    <input
                                        type="text"
                                        value={formData.cardHolderName}
                                        onChange={handleInputChange('cardHolderName')}
                                        placeholder="John Doe"
                                        className="w-full bg-base-100 dark:bg-base-200 border border-base-300 dark:border-base-content/10 rounded-xl px-4 py-3 text-base-content placeholder-base-content/50 focus:outline-none focus:border-primary focus:bg-base-50 dark:focus:bg-base-100 transition"
                                    />
                                </div>

                                {/* Expiry and CVV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-base-content mb-3">Vencimiento</label>
                                        <input
                                            type="text"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange('expiryDate')}
                                            placeholder="MM/YY"
                                            className="w-full bg-base-100 dark:bg-base-200 border border-base-300 dark:border-base-content/10 rounded-xl px-4 py-3 text-base-content placeholder-base-content/50 focus:outline-none focus:border-primary focus:bg-base-50 dark:focus:bg-base-100 transition font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-base-content mb-3">CVV</label>
                                        <div className="relative">
                                            <input
                                                type={showCVV ? 'text' : 'password'}
                                                value={formData.cvv}
                                                onChange={handleInputChange('cvv')}
                                                placeholder="123"
                                                className="w-full bg-base-100 dark:bg-base-200 border border-base-300 dark:border-base-content/10 rounded-xl px-4 py-3 text-base-content placeholder-base-content/50 focus:outline-none focus:border-primary focus:bg-base-50 dark:focus:bg-base-100 transition font-mono"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCVV(!showCVV)}
                                                className="absolute right-3 top-3.5 text-base-content/50 hover:text-base-content transition"
                                            >
                                                {showCVV ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/profile')}
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isProcessing || isPending}
                                        className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80"
                                    >
                                        {isProcessing || isPending ? 'Procesando...' : 'Recargar Saldo'}
                                    </Button>
                                </div>
                            </form>
                        </Section>
                    </div>
                </div>
            </Container>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-8 right-8 bg-success text-success-content px-6 py-4 rounded-xl shadow-2xl animate-bounce z-50">
                    ✓ ¡Balance recargado exitosamente!
                </div>
            )}
        </div>
    );
};