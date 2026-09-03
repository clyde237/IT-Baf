import { redirect } from '@sveltejs/kit';
import { isAdminAuthenticated } from '$lib/server/auth';
import { isNeonConnected } from '$lib/server/db/client';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const authenticated = isAdminAuthenticated(cookies);

	if (!authenticated && url.pathname !== '/admin/login') {
		throw redirect(303, `/admin/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	return {
		authenticated,
		isNeon: isNeonConnected()
	};
};
