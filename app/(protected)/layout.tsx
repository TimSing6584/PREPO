import { AuthProvider } from "./AuthProvider";
import { SyncUser } from "./SyncUser";
export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
    <AuthProvider>
        <SyncUser />
        {children}
    </AuthProvider>);
}