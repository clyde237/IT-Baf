import { fail, redirect, type Actions } from '@sveltejs/kit';
import { checkAdminPassword, setAdminSession, clearAdminSession, isAdminAuthenticated } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

// Rate limiting in-memory map
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const load: PageServerLoad = async ({ cookies }) => {
	if (isAdminAuthenticated(cookies)) {
		throw redirect(303, '/admin/contacts');
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies, getClientAddress, url }) => {
		const clientIp = getClientAddress ? getClientAddress() : 'unknown';
		const now = Date.now();
		const attempt = failedAttempts.get(clientIp);

		// Rate limit: max 5 failed attempts in 5 minutes
		if (attempt && attempt.count >= 5 && now - attempt.lastAttempt < 5 * 60 * 1000) {
			const remainingMinutes = Math.ceil((5 * 60 * 1000 - (now - attempt.lastAttempt)) / 60000);
			return fail(429, {
				error: `Trop de tentatives erronées. Veuillez patienter ${remainingMinutes} minute(s) avant de réessayer.`
			});
		}

		const data = await request.formData();
		const password = (data.get('password') as string) || '';

		if (!password) {
			return fail(400, { error: 'Veuillez saisir le mot de passe administrateur.' });
		}

		if (!checkAdminPassword(password)) {
			const currentCount = attempt ? attempt.count + 1 : 1;
			failedAttempts.set(clientIp, { count: currentCount, lastAttempt: now });

			return fail(401, {
				error: 'Mot de passe incorrect. Vérifiez vos accès auprès de la direction du Centre IT.'
			});
		}

		// Reset rate limit on success
		failedAttempts.delete(clientIp);

		setAdminSession(cookies);

		const redirectTo = url.searchParams.get('redirectTo') || '/admin/contacts';
		throw redirect(303, redirectTo);
	},

	logout: async ({ cookies }) => {
		clearAdminSession(cookies);
		throw redirect(303, '/admin/login');
	}
};
