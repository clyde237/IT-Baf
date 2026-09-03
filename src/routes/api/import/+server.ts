import { json, type RequestHandler } from '@sveltejs/kit';
import { parseContactsExcel } from '$lib/server/excel';
import { importBatch } from '$lib/server/db/client';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.formData();
		const file = data.get('file') as File | null;

		if (!file) {
			return json({ error: 'Aucun fichier reçu.' }, { status: 400 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const parsedRecords = await parseContactsExcel(buffer);

		if (parsedRecords.length === 0) {
			return json(
				{ error: 'Aucun contact valide détecté dans le fichier (vérifiez la structure).' },
				{ status: 400 }
			);
		}

		const result = await importBatch(parsedRecords);

		return json({
			success: true,
			message: `${parsedRecords.length} contacts analysés avec succès.`,
			added: result.added,
			updated: result.updated
		});
	} catch (err: any) {
		console.error('Error during Excel import:', err);
		return json({ error: err.message || "Erreur interne lors de l'import." }, { status: 500 });
	}
};
