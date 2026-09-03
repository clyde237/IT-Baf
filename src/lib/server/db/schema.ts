import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const contacts = pgTable('contacts', {
	id: uuid('id').primaryKey().defaultRandom(),
	centre_pole: varchar('centre_pole', { length: 50 }).notNull().default('Bafoussam'),
	nom_prenom: varchar('nom_prenom', { length: 120 }).notNull(),
	telephone: varchar('telephone', { length: 20 }).notNull(),
	sexe: varchar('sexe', { length: 20 }),
	statut_matrimonial: varchar('statut_matrimonial', { length: 50 }).default('Célibataire'),
	eglise: varchar('eglise', { length: 100 }),
	profession: varchar('profession', { length: 100 }),
	statut_classe: varchar('statut_classe', { length: 50 }).default('Non'),
	niveau_classe: varchar('niveau_classe', { length: 50 }),
	source: varchar('source', { length: 50 }).default('web_form'),
	created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export type ContactSelect = typeof contacts.$inferSelect;
export type ContactInsert = typeof contacts.$inferInsert;
