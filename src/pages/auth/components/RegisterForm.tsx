import React, { useState } from 'react';
import { useRegister } from '../../../api/generated/authentication/authentication';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import PasswordInput from '../../../components/ui/PasswordInput';
import Label from '../../../components/ui/Label';

export const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: '',
<<<<<<< HEAD
    });
=======
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
>>>>>>> 471294a (s)
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: register, isPending } = useRegister({
        mutation: {
            onSuccess: (data) => {
                localStorage.setItem('token', data.token || '');
                localStorage.setItem('userId', data.userId || '');
                localStorage.setItem('username', formData.username);
                queryClient.invalidateQueries();
                window.dispatchEvent(new Event('auth-change'));
                navigate('/');
            },
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
<<<<<<< HEAD
        register({ data: formData });
=======
        const newErrors: Record<string, string> = {};

        if (!formData.username || formData.username.trim().length === 0) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email || !formData.email.includes('@')) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.fullName || formData.fullName.trim().length === 0) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        // send only the expected fields to the API
        const payload = {
            username: formData.username,
            email: formData.email,
            fullName: formData.fullName,
            password: formData.password,
        };

        register({ data: payload });
>>>>>>> 471294a (s)
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <Label htmlFor="reg-username">Username</Label>
                <Input
                    id="reg-username"
                    fullWidth
                    value={formData.username}
<<<<<<< HEAD
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
=======
                    onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value });
                        if (errors.username) setErrors({ ...errors, username: '' });
                    }}
                    required
                />
                {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
>>>>>>> 471294a (s)
            </div>
            <div>
                <Label htmlFor="reg-email">Email</Label>
                <Input
                    id="reg-email"
                    type="email"
                    fullWidth
                    value={formData.email}
<<<<<<< HEAD
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
=======
                    onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    required
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
>>>>>>> 471294a (s)
            </div>
            <div>
                <Label htmlFor="reg-fullname">Full Name</Label>
                <Input
                    id="reg-fullname"
                    fullWidth
                    value={formData.fullName}
<<<<<<< HEAD
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                />
=======
                    onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    required
                />
                {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
>>>>>>> 471294a (s)
            </div>
            <div>
                <Label htmlFor="reg-password">Password</Label>
                <PasswordInput
                    id="reg-password"
                    fullWidth
                    value={formData.password}
<<<<<<< HEAD
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
=======
                    onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    required
                />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
            <div>
                <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                <PasswordInput
                    id="reg-confirm-password"
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    required
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                )}
>>>>>>> 471294a (s)
            </div>
            <Button type="submit" fullWidth disabled={isPending}>
                {isPending ? 'Creating account...' : 'Sign up'}
            </Button>
        </form>
    );
};
