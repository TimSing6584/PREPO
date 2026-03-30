import { AuthProvider } from "./AuthProvider";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProvider>{children}</AuthProvider>;
}