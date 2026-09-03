export type StatutClasseIT = 'Non' | 'Oui' | 'Déjà dans une classe';

export type NiveauClasseIT = 'Initiation' | 'Modelage' | 'Impact';

export type Sexe = 'Masculin' | 'Féminin';

export type StatutMatrimonial =
	| 'Célibataire'
	| 'Marié(e)'
	| 'Divorcé(e)/séparé(e)'
	| 'Veuf(ve)';

export interface Contact {
	id: string;
	centre_pole: string;
	nom_prenom: string;
	telephone: string;
	sexe?: string;
	statut_matrimonial: string;
	eglise: string;
	profession: string;
	statut_classe: string;
	statut_classe_it?: string; // alias
	niveau_classe?: string; // 'Initiation' | 'Modelage' | 'Impact'
	source?: string;
	created_at: string;
	updated_at?: string;
}

export type NewContact = Omit<Contact, 'id' | 'created_at'> & {
	id?: string;
	created_at?: string;
};

export interface ContactFilterOptions {
	query?: string;
	statut_classe?: string;
	statut_classe_it?: string;
	niveau_classe?: string;
	statut_matrimonial?: string;
	sexe?: string;
	page?: number;
	limit?: number;
	sortBy?: keyof Contact;
	sortOrder?: 'asc' | 'desc';
}

export interface ContactStats {
	total: number;
	enClasse: number;
	souhaiteClasse: number;
	nonInteresse: number;
	derniersInscritsAujourdhui: number;
	initiation?: number;
	modelage?: number;
	impact?: number;
}
