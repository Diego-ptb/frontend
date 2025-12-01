export const getAvatarUrl = (url?: string | null, username?: string | null) => {
    if (url) return url;
    const name = username || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
};
