import zod from 'zod';

const envSchema = zod.object({
	BASE_URL: zod.string(),
});

export const env = envSchema.parse({
	BASE_URL: process.env.BASE_URL || '',
});
