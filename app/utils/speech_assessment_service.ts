import jwt from "jsonwebtoken"

export function generateServiceToken(): string {
    const secret = process.env.SPEECH_ASSESS_SERVICE_JWT_SECRET

    if (!secret) {
        throw new Error("servce-to-service secret is not set")
    }

    return jwt.sign(
        { service: "nextjs" },
        secret,
        { expiresIn: "30s" }
    )
}