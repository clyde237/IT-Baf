import { getAllContacts } from '$lib/server/db/client';
import { generateContactsExcel } from '$lib/server/excel';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const { contacts } = await getAllContacts({ limit: 10000 });
	const buffer = await generateContactsExcel(contacts);

	const today = new Date().toISOString().split('T')[0];
	const filename = `Contacts_IT_Bafoussam_${today}.xlsx`;

	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};
