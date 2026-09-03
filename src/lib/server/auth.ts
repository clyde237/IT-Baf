import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'it_admin_session';
const SESSION_TOKEN = 'it_bafoussam_authenticated_session_token_2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Tyrannus2026@';

export function checkAdminPassword(password: string): boolean {
	return password === ADMIN_PASSWORD;
}

export function setAdminSession(cookies: Cookies): void {
	cookies.set(COOKIE_NAME, SESSION_TOKEN, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});
}

export function clearAdminSession(cookies: Cookies): void {
	cookies.delete(COOKIE_NAME, { path: '/' });
}

export function isAdminAuthenticated(cookies: Cookies): boolean {
	return cookies.get(COOKIE_NAME) === SESSION_TOKEN;
}
