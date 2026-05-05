import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
// Function to check if the user has the required role
export async function roleChecker(requiredRole: string): Promise<boolean> {
    const {getAccessToken} = getKindeServerSession();
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return false;
    }
    const roles = accessToken.roles as { key: string }[] | undefined;
    return roles?.some(r => r.key === requiredRole) ?? false;
}