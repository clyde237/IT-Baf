import ExcelJS from 'exceljs';
import type { Contact } from '$lib/types/contact';

/**
 * Generates an Excel (.xlsx) buffer formatted with Institut Tyrannus brand identity:
 * - Header row in IT dark green (#006b2e) with bold white text
 * - Auto-adjusted column widths
 * - Sexe and Niveau Classe included
 * - Text format '@' for telephone numbers to strictly preserve leading zeros
 * - Light alternating rows and borders
 */
export async function generateContactsExcel(contactsList: Contact[]): Promise<Buffer> {
	const workbook = new ExcelJS.Workbook();
	workbook.creator = 'Institut Tyrannus — Centre de Bafoussam';
	workbook.lastModifiedBy = 'Plateforme IT Contacts';
	workbook.created = new Date();

	const worksheet = workbook.addWorksheet('Contacts Bafoussam', {
		views: [{ showGridLines: true }]
	});

	// Column definitions
	worksheet.columns = [
		{ header: 'Pôle / Centre', key: 'centre_pole', width: 20 },
		{ header: 'Noms et Prénoms', key: 'nom_prenom', width: 28 },
		{ header: 'Sexe', key: 'sexe', width: 14 },
		{ header: 'Numéro de Téléphone', key: 'telephone', width: 22, style: { numFmt: '@' } },
		{ header: 'Statut Matrimonial', key: 'statut_matrimonial', width: 20 },
		{ header: 'Assemblée / Église', key: 'eglise', width: 26 },
		{ header: 'Profession / Activité', key: 'profession', width: 24 },
		{ header: 'Statut Classes IT', key: 'statut_classe', width: 22 },
		{ header: 'Niveau Classe', key: 'niveau_classe', width: 18 },
		{ header: "Date d'enregistrement", key: 'created_at', width: 22 }
	];

	// Style Header Row (Institut Tyrannus Dark Green #006b2e)
	const headerRow = worksheet.getRow(1);
	headerRow.height = 30;
	headerRow.eachCell((cell) => {
		cell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: 'FF006B2E' }
		};
		cell.font = {
			name: 'Arial',
			size: 11,
			bold: true,
			color: { argb: 'FFFFFFFF' }
		};
		cell.alignment = {
			vertical: 'middle',
			horizontal: 'center'
		};
		cell.border = {
			top: { style: 'thin', color: { argb: 'FF004D21' } },
			left: { style: 'thin', color: { argb: 'FF004D21' } },
			bottom: { style: 'medium', color: { argb: 'FF004D21' } },
			right: { style: 'thin', color: { argb: 'FF004D21' } }
		};
	});

	// Insert data rows
	contactsList.forEach((contact, idx) => {
		const row = worksheet.addRow({
			centre_pole: contact.centre_pole || 'Bafoussam',
			nom_prenom: contact.nom_prenom,
			sexe: contact.sexe || '',
			telephone: String(contact.telephone),
			statut_matrimonial: contact.statut_matrimonial || 'Célibataire',
			eglise: contact.eglise || '',
			profession: contact.profession || '',
			statut_classe: contact.statut_classe || contact.statut_classe_it || 'Non',
			niveau_classe: contact.niveau_classe || '',
			created_at: contact.created_at
				? new Date(contact.created_at).toLocaleDateString('fr-FR', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					})
				: ''
		});

		row.height = 24;

		// Zebra background coloring for enhanced readability
		const isEven = idx % 2 === 0;
		row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
			// Enforce text formatting on phone number column (col 4)
			if (colNumber === 4) {
				cell.numFmt = '@';
				cell.alignment = { vertical: 'middle', horizontal: 'center' };
			} else {
				cell.alignment = { vertical: 'middle' };
			}

			if (isEven) {
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'FFF8FAFC' }
				};
			}

			cell.border = {
				top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
				left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
				bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
				right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
			};
		});
	});

	const buffer = await workbook.xlsx.writeBuffer();
	return Buffer.from(buffer);
}

/**
 * Parses uploaded Excel workbook with smart column detection.
 * Automatically recognizes both standard column headers and legacy shifted headers
 * from the historical "Contacts Baf.xlsx" file.
 */
export async function parseContactsExcel(fileBuffer: Buffer): Promise<
	Array<{
		centre_pole: string;
		nom_prenom: string;
		telephone: string;
		sexe?: string;
		statut_matrimonial: string;
		eglise: string;
		profession: string;
		statut_classe: string;
		statut_classe_it: string;
		niveau_classe?: string;
	}>
> {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(fileBuffer as any);

	const worksheet = workbook.worksheets[0];
	if (!worksheet) {
		throw new Error('Aucune feuille trouvée dans le classeur Excel.');
	}

	// Read header row
	const headerRow = worksheet.getRow(1);
	const headers: string[] = [];
	headerRow.eachCell((cell, colNumber) => {
		headers[colNumber] = (cell.text || '').toLowerCase().trim();
	});

	// Check if this matches the historical shifted format ("Que voulez-vous faire ?" for name, etc.)
	const isHistoricalShifted = headers.some(
		(h) => h?.includes('que voulez-vous faire') || h?.includes('activité')
	);

	const parsedContacts: Array<{
		centre_pole: string;
		nom_prenom: string;
		telephone: string;
		sexe?: string;
		statut_matrimonial: string;
		eglise: string;
		profession: string;
		statut_classe: string;
		statut_classe_it: string;
		niveau_classe?: string;
	}> = [];

	worksheet.eachRow((row, rowNumber) => {
		if (rowNumber === 1) return; // skip header

		let centre_pole = 'Bafoussam';
		let nom_prenom = '';
		let telephone = '';
		let sexe = 'Masculin';
		let statut_matrimonial = 'Célibataire';
		let eglise = '';
		let profession = '';
		let statut_classe_it = 'Non';
		let niveau_classe: string | undefined = undefined;

		if (isHistoricalShifted) {
			centre_pole = row.getCell(1).text?.trim() || 'Bafoussam';
			nom_prenom = row.getCell(2).text?.trim() || '';
			telephone = row.getCell(3).text?.trim() || '';
			statut_matrimonial = row.getCell(4).text?.trim() || 'Célibataire';
			eglise = row.getCell(5).text?.trim() || '';
			profession = row.getCell(6).text?.trim() || '';
			statut_classe_it = row.getCell(7).text?.trim() || 'Non';
		} else {
			centre_pole = row.getCell(1).text?.trim() || 'Bafoussam';
			nom_prenom = row.getCell(2).text?.trim() || '';
			sexe = row.getCell(3).text?.trim() || 'Masculin';
			telephone = row.getCell(4).text?.trim() || row.getCell(3).text?.trim() || '';
			statut_matrimonial = row.getCell(5).text?.trim() || 'Célibataire';
			eglise = row.getCell(6).text?.trim() || '';
			profession = row.getCell(7).text?.trim() || '';
			statut_classe_it = row.getCell(8).text?.trim() || 'Non';
			niveau_classe = row.getCell(9).text?.trim() || undefined;
		}

		// Normalize phone
		const cleanPhone = telephone.replace(/[^\d+]/g, '');

		if (nom_prenom && cleanPhone) {
			parsedContacts.push({
				centre_pole,
				nom_prenom,
				telephone: cleanPhone,
				sexe,
				statut_matrimonial,
				eglise,
				profession,
				statut_classe: statut_classe_it,
				statut_classe_it,
				niveau_classe
			});
		}
	});

	return parsedContacts;
}
