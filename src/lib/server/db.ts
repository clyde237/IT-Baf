import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';

const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("La variable d'environnement DATABASE_URL n'est pas définie dans .env");
}

// Client Neon SQL Serverless
export const sql = neon(databaseUrl);
