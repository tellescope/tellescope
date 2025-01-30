export declare const PublicEndpoints: (o?: {
    host?: string;
}) => {
    login_enduser: (a: {
        email?: string;
        id?: string;
        phone?: string;
        password: string;
    }) => Promise<{
        authToken: string;
    }>;
};
//# sourceMappingURL=public.d.ts.map