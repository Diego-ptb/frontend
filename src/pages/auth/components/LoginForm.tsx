import React, { useState } from 'react';
import { useLogin } from '../../../api/generated/authentication/authentication';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import PasswordInput from '../../../components/ui/PasswordInput';
import Label from '../../../components/ui/Label';

export const LoginForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: login, isPending } = useLogin({
        mutation: {
            onSuccess: (data) => {
                localStorage.setItem('token', (data.token as string) || '');
                localStorage.setItem('userId', (data.userId as string) || '');
                localStorage.setItem('username', formData.username);
                queryClient.invalidateQueries();
                // Dispatch custom event to notify auth state change
                window.dispatchEvent(new Event('auth-change'));
                navigate('/');
            },
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ data: formData });
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    fullWidth
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                    id="password"
                    fullWidth
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
            </div>
            <Button type="submit" fullWidth disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
        </form>
    );
};
