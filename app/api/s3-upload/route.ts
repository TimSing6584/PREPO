import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

async function uploadFileToS3(file: Buffer, fileName: string, contentType: string, folder_name: string): Promise<string> {
    const key = `${folder_name}/${fileName}-${Date.now()}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType  // dynamic
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const folder_name = formData.get("folder_name") as string || "default";
        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "File is required." }, { status: 400 });
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/jpg"];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadFileToS3(buffer, file.name, file.type, folder_name);

        return NextResponse.json({ success: true, url });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}