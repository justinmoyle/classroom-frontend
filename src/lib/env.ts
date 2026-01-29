import { z } from 'zod';

const envSchema = z.object({
    VITE_CLOUDINARY_UPLOAD_URL: z.string().url(),
    VITE_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    VITE_BACKEND_BASE_URL: z.string().url(),
    VITE_API_URL: z.string().url(),
    VITE_ACCESS_TOKEN_KEY: z.string().min(1),
    VITE_REFRESH_TOKEN_KEY: z.string().min(1),
    VITE_CLOUDINARY_UPLOAD_PRESET: z.string().min(1),
});

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

export const env = _env.data;
