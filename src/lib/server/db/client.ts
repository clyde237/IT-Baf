import { sql } from '$lib/server/db';
import type {
	Contact,
	NewContact,
	ContactFilterOptions,
	ContactStats
} from '$lib/types/contact';

function normalizeMatrimonial(
	raw: string | undefined
): 'Célibataire' | 'Marié(e)' | 'Divorcé(e)/séparé(e)' | 'Veuf(ve)' | 'Autre' {
	if (!raw) return 'Célibataire';

	const s = raw.toLowerCase();

	if (s.includes('mari')) return 'Marié(e)';
	if (s.includes('cél') || s.includes('cel')) return 'Célibataire';
	if (s.includes('veuf')) return 'Veuf(ve)';
	if (s.includes('divorc') || s.includes('sépar')) return 'Divorcé(e)/séparé(e)';

	return 'Célibataire';
}

function normalizeStatutClasse(
	raw: string | undefined
): 'Non' | 'Oui' | 'Déjà dans une classe' {
	if (!raw) return 'Non';

	const s = raw.toLowerCase();

	if (s.includes('déjà') || s.includes('deja') || s.includes('classe')) {
		return 'Déjà dans une classe';
	}

	if (s.includes('oui')) return 'Oui';

	return 'Non';
}

function normalizeNiveauClasse(raw: string | undefined): string | null {
	if (!raw) return null;

	const s = raw.trim();

	if (s === 'Initiation' || s === 'Modelage' || s === 'Impact') {
		return s;
	}

	return s || null;
}

function normalizeSexe(raw: string | undefined): string | null {
	if (!raw) return null;

	const s = raw.trim();

	if (s === 'Masculin' || s === 'Féminin') {
		return s;
	}

	if (s.toLowerCase().startsWith('m') || s.toLowerCase().startsWith('h')) {
		return 'Masculin';
	}

	if (s.toLowerCase().startsWith('f')) {
		return 'Féminin';
	}

	return s;
}

function mapRow(r: any): Contact {
	const statut_classe = r.statut_classe || r.statut_classe_it || 'Non';

	return {
		id: r.id,
		centre_pole: r.centre_pole || 'Bafoussam',
		nom_prenom: r.nom_prenom || '',
		telephone: r.telephone || '',
		sexe: r.sexe || '',
		statut_matrimonial: r.statut_matrimonial || 'Célibataire',
		eglise: r.eglise || '',
		profession: r.profession || '',
		statut_classe: statut_classe,
		statut_classe_it: statut_classe,
		niveau_classe: r.niveau_classe || '',
		source: r.source || 'web_form',
		created_at: r.created_at
			? new Date(r.created_at).toISOString()
			: new Date().toISOString(),
		updated_at: r.updated_at
			? new Date(r.updated_at).toISOString()
			: undefined
	};
}

export function isNeonConnected(): boolean {
	return true;
}

export async function getAllContacts(
	filters: ContactFilterOptions = {}
): Promise<{
	contacts: Contact[];
	total: number;
	page: number;
	totalPages: number;
}> {
	try {
		const rows = await sql`
			SELECT *
			FROM contacts
			ORDER BY created_at DESC;
		`;

		let list = rows.map(mapRow);

		// Recherche générale
		if (filters.query && filters.query.trim() !== '') {
			const q = filters.query.toLowerCase().trim();

			list = list.filter(
				(c) =>
					c.nom_prenom.toLowerCase().includes(q) ||
					c.telephone.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
					c.eglise.toLowerCase().includes(q) ||
					c.profession.toLowerCase().includes(q) ||
					(c.niveau_classe &&
						c.niveau_classe.toLowerCase().includes(q))
			);
		}

		// Filtre par statut de classe
		const classeFilter =
			filters.statut_classe || filters.statut_classe_it;

		if (classeFilter && classeFilter !== 'all') {
			list = list.filter(
				(c) => c.statut_classe === classeFilter
			);
		}

		// Filtre par niveau de classe
		if (
			filters.niveau_classe &&
			filters.niveau_classe !== 'all'
		) {
			list = list.filter(
				(c) => c.niveau_classe === filters.niveau_classe
			);
		}

		// Filtre par statut matrimonial
		if (
			filters.statut_matrimonial &&
			filters.statut_matrimonial !== 'all'
		) {
			list = list.filter(
				(c) =>
					c.statut_matrimonial ===
					filters.statut_matrimonial
			);
		}

		// Filtre par sexe
		if (filters.sexe && filters.sexe !== 'all') {
			list = list.filter(
				(c) => c.sexe === filters.sexe
			);
		}

		const total = list.length;

		const page = Math.max(1, filters.page || 1);
		const limit = Math.max(1, filters.limit || 25);

		const totalPages = Math.max(
			1,
			Math.ceil(total / limit)
		);

		const startIndex = (page - 1) * limit;

		const paginated = list.slice(
			startIndex,
			startIndex + limit
		);

		return {
			contacts: paginated,
			total,
			page,
			totalPages
		};
	} catch (err) {
		console.error('Neon query error:', err);

		// En production, on ne tente plus d'écrire
		// dans le système de fichiers de Vercel.
		return {
			contacts: [],
			total: 0,
			page: 1,
			totalPages: 1
		};
	}
}

export async function createContact(
	data: NewContact
): Promise<Contact> {
	const centre_pole =
		data.centre_pole?.trim() || 'Bafoussam';

	const nom_prenom = data.nom_prenom.trim();
	const telephone = data.telephone.trim();

	const sexe = normalizeSexe(data.sexe);

	const statut_matrimonial =
		normalizeMatrimonial(data.statut_matrimonial);

	const eglise =
		data.eglise?.trim() || null;

	const profession =
		data.profession?.trim() || null;

	const statut_classe =
		normalizeStatutClasse(
			data.statut_classe ||
				data.statut_classe_it
		);

	const niveau_classe =
		statut_classe === 'Déjà dans une classe'
			? normalizeNiveauClasse(
					data.niveau_classe
				)
			: null;

	const source =
		data.source || 'web_form';

	try {
		const result = await sql`
			INSERT INTO contacts (
				centre_pole,
				nom_prenom,
				telephone,
				sexe,
				statut_matrimonial,
				eglise,
				profession,
				statut_classe,
				niveau_classe,
				source
			)
			VALUES (
				${centre_pole},
				${nom_prenom},
				${telephone},
				${sexe},
				${statut_matrimonial},
				${eglise},
				${profession},
				${statut_classe},
				${niveau_classe},
				${source}
			)
			RETURNING *;
		`;

		return mapRow(result[0]);
	} catch (err) {
		console.error(
			'Error inserting contact into Neon:',
			err
		);

		throw err;
	}
}

export async function updateContact(
	id: string,
	updates: Partial<Contact>
): Promise<Contact | null> {
	const centre_pole =
		updates.centre_pole?.trim() ||
		'Bafoussam';

	const nom_prenom =
		updates.nom_prenom?.trim();

	const telephone =
		updates.telephone?.trim();

	const sexe =
		updates.sexe !== undefined
			? normalizeSexe(updates.sexe)
			: undefined;

	const statut_matrimonial =
		updates.statut_matrimonial
			? normalizeMatrimonial(
					updates.statut_matrimonial
				)
			: undefined;

	const eglise =
		updates.eglise !== undefined
			? updates.eglise.trim() || null
			: undefined;

	const profession =
		updates.profession !== undefined
			? updates.profession.trim() || null
			: undefined;

	const statut_classe =
		updates.statut_classe ||
		updates.statut_classe_it
			? normalizeStatutClasse(
					updates.statut_classe ||
						updates.statut_classe_it
				)
			: undefined;

	const niveau_classe =
		updates.niveau_classe !== undefined
			? normalizeNiveauClasse(
					updates.niveau_classe
				)
			: undefined;

	try {
		const res = await sql`
			UPDATE contacts
			SET
				centre_pole =
					COALESCE(
						${centre_pole},
						centre_pole
					),

				nom_prenom =
					COALESCE(
						${nom_prenom},
						nom_prenom
					),

				telephone =
					COALESCE(
						${telephone},
						telephone
					),

				sexe =
					COALESCE(
						${sexe},
						sexe
					),

				statut_matrimonial =
					COALESCE(
						${statut_matrimonial},
						statut_matrimonial
					),

				eglise =
					COALESCE(
						${eglise},
						eglise
					),

				profession =
					COALESCE(
						${profession},
						profession
					),

				statut_classe =
					COALESCE(
						${statut_classe},
						statut_classe
					),

				niveau_classe =
					COALESCE(
						${niveau_classe},
						niveau_classe
					),

				updated_at = NOW()

			WHERE id = ${id}

			RETURNING *;
		`;

		if (res.length === 0) {
			return null;
		}

		return mapRow(res[0]);
	} catch (err) {
		console.error(
			'Error updating contact in Neon:',
			err
		);

		throw err;
	}
}

export async function deleteContact(
	id: string
): Promise<boolean> {
	try {
		const res = await sql`
			DELETE FROM contacts
			WHERE id = ${id}
			RETURNING id;
		`;

		return res.length > 0;
	} catch (err) {
		console.error(
			'Error deleting contact from Neon:',
			err
		);

		throw err;
	}
}

export async function getContactStats(): Promise<ContactStats> {
	try {
		const rows = await sql`
			SELECT
				COUNT(*) AS total,

				COUNT(*)
					FILTER (
						WHERE statut_classe =
						'Déjà dans une classe'
					) AS en_classe,

				COUNT(*)
					FILTER (
						WHERE statut_classe = 'Oui'
					) AS souhaite_classe,

				COUNT(*)
					FILTER (
						WHERE statut_classe = 'Non'
					) AS non_interesse,

				COUNT(*)
					FILTER (
						WHERE created_at >= CURRENT_DATE
					) AS aujourdhui,

				COUNT(*)
					FILTER (
						WHERE niveau_classe =
						'Initiation'
					) AS initiation,

				COUNT(*)
					FILTER (
						WHERE niveau_classe =
						'Modelage'
					) AS modelage,

				COUNT(*)
					FILTER (
						WHERE niveau_classe =
						'Impact'
					) AS impact

			FROM contacts;
		`;

		const stat = rows[0] || {};

		return {
			total: parseInt(
				String(stat.total || '0'),
				10
			),

			enClasse: parseInt(
				String(stat.en_classe || '0'),
				10
			),

			souhaiteClasse: parseInt(
				String(stat.souhaite_classe || '0'),
				10
			),

			nonInteresse: parseInt(
				String(stat.non_interesse || '0'),
				10
			),

			derniersInscritsAujourdhui:
				parseInt(
					String(stat.aujourdhui || '0'),
					10
				),

			initiation: parseInt(
				String(stat.initiation || '0'),
				10
			),

			modelage: parseInt(
				String(stat.modelage || '0'),
				10
			),

			impact: parseInt(
				String(stat.impact || '0'),
				10
			)
		};
	} catch (err) {
		console.error(
			'Error fetching stats from Neon:',
			err
		);

		return {
			total: 0,
			enClasse: 0,
			souhaiteClasse: 0,
			nonInteresse: 0,
			derniersInscritsAujourdhui: 0,
			initiation: 0,
			modelage: 0,
			impact: 0
		};
	}
}

export async function importBatch(
	records: Array<
		Omit<Contact, 'id' | 'created_at'>
	>
): Promise<{
	added: number;
	updated: number;
}> {
	let added = 0;
	let updated = 0;

	for (const rec of records) {
		const cleanPhone =
			rec.telephone.replace(
				/[^\d+]/g,
				''
			);

		const nom_prenom =
			rec.nom_prenom.trim();

		const centre_pole =
			rec.centre_pole?.trim() ||
			'Bafoussam';

		const sexe =
			normalizeSexe(rec.sexe);

		const statut_matrimonial =
			normalizeMatrimonial(
				rec.statut_matrimonial
			);

		const eglise =
			rec.eglise?.trim() || null;

		const profession =
			rec.profession?.trim() || null;

		const statut_classe =
			normalizeStatutClasse(
				rec.statut_classe ||
					rec.statut_classe_it
			);

		const niveau_classe =
			statut_classe ===
			'Déjà dans une classe'
				? normalizeNiveauClasse(
						rec.niveau_classe
					)
				: null;

		try {
			const existing = await sql`
				SELECT id
				FROM contacts
				WHERE telephone = ${cleanPhone}
				LIMIT 1;
			`;

			if (existing.length > 0) {
				await sql`
					UPDATE contacts
					SET
						nom_prenom =
							${nom_prenom},

						centre_pole =
							${centre_pole},

						sexe =
							COALESCE(
								${sexe},
								sexe
							),

						statut_matrimonial =
							${statut_matrimonial},

						eglise =
							${eglise},

						profession =
							${profession},

						statut_classe =
							${statut_classe},

						niveau_classe =
							COALESCE(
								${niveau_classe},
								niveau_classe
							),

						updated_at =
							NOW()

					WHERE id =
						${existing[0].id};
				`;

				updated++;
			} else {
				await sql`
					INSERT INTO contacts (
						centre_pole,
						nom_prenom,
						telephone,
						sexe,
						statut_matrimonial,
						eglise,
						profession,
						statut_classe,
						niveau_classe,
						source
					)
					VALUES (
						${centre_pole},
						${nom_prenom},
						${cleanPhone},
						${sexe},
						${statut_matrimonial},
						${eglise},
						${profession},
						${statut_classe},
						${niveau_classe},
						'excel_import'
					);
				`;

				added++;
			}
		} catch (e) {
			console.error(
				`Error importing row for ${nom_prenom}:`,
				e
			);
		}
	}

	return {
		added,
		updated
	};
}