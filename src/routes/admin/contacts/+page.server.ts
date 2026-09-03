import { getAllContacts, getContactStats } from '$lib/server/db/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const statut_classe_it = url.searchParams.get('classe') || 'all';
	const statut_matrimonial = url.searchParams.get('matrimonial') || 'all';
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const limit = parseInt(url.searchParams.get('limit') || '25', 10);

	try {
		const [contactsData, stats] = await Promise.all([
			getAllContacts({
				query,
				statut_classe_it,
				statut_matrimonial,
				page,
				limit
			}),
			getContactStats()
		]);

		return {
			contacts: contactsData.contacts,
			total: contactsData.total,
			page: contactsData.page,
			totalPages: contactsData.totalPages,
			stats,
			filters: {
				query,
				statut_classe_it,
				statut_matrimonial
			}
		};
	} catch (err) {
		console.error('Error loading admin contacts page:', err);
		return {
			contacts: [],
			total: 0,
			page: 1,
			totalPages: 1,
			stats: {
				total: 0,
				enClasse: 0,
				souhaiteClasse: 0,
				nonInteresse: 0,
				derniersInscritsAujourdhui: 0
			},
			filters: {
				query,
				statut_classe_it,
				statut_matrimonial
			}
		};
	}
};
