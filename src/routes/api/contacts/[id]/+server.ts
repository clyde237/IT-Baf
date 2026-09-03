import { json, type RequestHandler } from '@sveltejs/kit';
import { updateContact, deleteContact } from '$lib/server/db/client';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = params.id;
	if (!id) {
		return json({ error: 'Identifiant manquant' }, { status: 400 });
	}

	try {
		const body = await request.json();
		const updated = await updateContact(id, body);
		if (!updated) {
			return json({ error: 'Contact introuvable' }, { status: 404 });
		}
		return json(updated);
	} catch (err: any) {
		return json({ error: err.message || 'Erreur lors de la mise à jour' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) {
		return json({ error: 'Identifiant manquant' }, { status: 400 });
	}

	try {
		const success = await deleteContact(id);
		if (!success) {
			return json({ error: 'Contact non trouvé' }, { status: 404 });
		}
		return json({ success: true });
	} catch (err: any) {
		return json({ error: err.message || 'Erreur lors de la suppression' }, { status: 500 });
	}
};
