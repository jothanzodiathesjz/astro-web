export type AuthRepository = {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};
