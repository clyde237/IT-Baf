import { sql } from '$lib/server/db';
import { createContact } from '$lib/server/db/client';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// 1. Lecture pour vérifier la connexion avec Neon
export const load: PageServerLoad = async () => {
	try {
		const contactsCount = await sql`SELECT COUNT(*) as total FROM contacts`;
		return {
			totalContacts: parseInt(contactsCount[0]?.total || '0', 10)
		};
	} catch (error) {
		console.error('Erreur de connexion à Neon :', error);
		return {
			totalContacts: 0,
			dbError: 'Impossible de joindre la base de données Neon'
		};
	}
};

// 2. Action pour enregistrer un nouveau contact depuis le formulaire
export const actions: Actions = {
	register: async ({ request }) => {
		const data = await request.formData();

		const nom_prenom = data.get('nom_prenom')?.toString().trim() || '';
		const telephone = data.get('telephone')?.toString().replace(/\s+/g, '') || '';
		const sexe = data.get('sexe')?.toString().trim() || 'Masculin';
		const statut_matrimonial = data.get('statut_matrimonial')?.toString() || 'Célibataire';
		const eglise = data.get('eglise')?.toString().trim() || '';
		const profession = data.get('profession')?.toString().trim() || '';
		const statut_classe = data.get('statut_classe')?.toString() || data.get('statut_classe_it')?.toString() || 'Non';
		const niveau_classe = data.get('niveau_classe')?.toString().trim() || undefined;
		const centre_pole = data.get('centre_pole')?.toString() || 'Bafoussam';

		if (!nom_prenom || !telephone) {
			return fail(400, { error: 'Le nom et le numéro de téléphone sont obligatoires.' });
		}

		if (!/^6\d{8}$/.test(telephone)) {
			return fail(400, { error: 'Numéro invalide. Format attendu : 9 chiffres (ex: 673 65 89 51).' });
		}

		try {
			await createContact({
				centre_pole,
				nom_prenom,
				telephone,
				sexe,
				statut_matrimonial,
				eglise,
				profession,
				statut_classe,
				niveau_classe,
				source: 'web_form'
			});
		} catch (err) {
			console.error("Erreur lors de l'insertion dans Neon :", err);
			return fail(500, { error: "Erreur lors de l'enregistrement dans la base de données." });
		}

		throw redirect(303, `/succes?nom=${encodeURIComponent(nom_prenom)}`);
	}
};
