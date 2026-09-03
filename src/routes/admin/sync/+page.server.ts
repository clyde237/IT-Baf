import { getContactStats } from '$lib/server/db/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const stats = await getContactStats();
	return { stats };
};
