import React, { createContext, useContext, useEffect, useState } from 'react';
import { DICTIONARY, type Language, type Dictionary } from '../constants/i18n';
import { useGetCurrentUser, useUpdateProfile } from '../api/generated/users/users';
import { UserProfileDtoLanguage } from '../api/generated/model/userProfileDtoLanguage';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    // Initialize from localStorage or default to EN
    const [language, setLanguageState] = useState<Language>(() => {
        const savedLang = localStorage.getItem('language');
        return (savedLang as Language) || 'EN';
    });

    const { data: user } = useGetCurrentUser();
    const { mutate: updateProfile } = useUpdateProfile();

    // Sync with user profile when loaded
    useEffect(() => {
        if (user?.language) {
            const userLang = user.language.toUpperCase() as Language;
            if (userLang !== language) {
                setLanguageState(userLang);
                localStorage.setItem('language', userLang);
            }
        }
    }, [user]);

    const setLanguage = (newLang: Language) => {
        setLanguageState(newLang);
        localStorage.setItem('language', newLang);

        // Update user profile if logged in
        if (user?.username) {
            updateProfile({
                data: {
                    language: newLang.toLowerCase() as UserProfileDtoLanguage
                }
            });
        }
    };

    const value = {
        language,
        setLanguage,
        t: DICTIONARY[language] as Dictionary
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
