import { AuthProvider } from "./AuthProvider";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/app/utils/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    if(!user){
        redirect("api/auth/login");
    }
    // const cookieStore = await cookies();
    // const userSynced = cookieStore.get("user_synced");

    // if (!userSynced || userSynced.value !== user.id) {
    await prisma.user.upsert({
        where: { kindeId: user.id },
        update: {
            email: user.email ?? "",
            name: user.given_name ?? "",
        },
        create: {
            kindeId: user.id,
            email: user.email ?? "",
            name: user.given_name ?? "",
        },
    });

    // cookieStore.set("user_synced", user.id, {
    //         httpOnly: true,
    //         maxAge: 60 * 60 * 24,
    //     });
    // }
    return <AuthProvider>{children}</AuthProvider>;
}