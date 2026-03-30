import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
export async function GET() {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    if(!user){
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const cookieStore = await cookies();
    const userSynced = cookieStore.get("user_synced");
    if (!userSynced || userSynced.value !== user.id) {
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
        cookieStore.set("user_synced", user.id, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
        });
    }
    return NextResponse.json({success:true})
}