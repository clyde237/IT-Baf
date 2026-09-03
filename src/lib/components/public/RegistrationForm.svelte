<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import PillSelector from '$lib/components/ui/PillSelector.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { User, Phone, Briefcase, Church, CheckCircle, GraduationCap } from '@lucide/svelte';

	interface Props {
		onsubmit?: (data: any) => Promise<void> | void;
		loading?: boolean;
		actionUrl?: string;
	}

	let { onsubmit, loading = false, actionUrl = '?/register' }: Props = $props();

	let centre_pole = $state('Bafoussam');
	let nom_prenom = $state('');
	let telephone = $state('');
	let sexe = $state('Masculin');
	let statut_matrimonial = $state('Célibataire');
	let profession = $state('');
	let eglise = $state('');
	let statut_classe_it = $state('Non');
	let niveau_classe = $state('Initiation');

	let errors = $state<Record<string, string>>({});

	// Profession suggestions
	const professionSuggestions = [
		'Enseignant(e)',
		'Commerçant(e)',
		'Élève / Étudiant(e)',
		'Ingénieur / Technicien',
		'Professionnel de santé',
		'Agriculteur / Éleveur',
		'Fonctionnaire / Cadre',
		'Artisan / Ouvrier',
		'Pasteur / Responsable',
		'Sans emploi / En recherche'
	];

	// Capitalize words automatically
	function formatName(text: string) {
		return text
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	function handleNameBlur() {
		if (nom_prenom.trim()) {
			nom_prenom = formatName(nom_prenom.trim());
		}
	}

	// Format Cameroon phone number while typing: 6xx xxx xxx
	function handlePhoneInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		let raw = e.currentTarget.value.replace(/\D/g, '');
		if (raw.length > 9) {
			raw = raw.slice(0, 9);
		}
		if (raw.length > 5) {
			telephone = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
		} else if (raw.length > 3) {
			telephone = `${raw.slice(0, 3)} ${raw.slice(3)}`;
		} else {
			telephone = raw;
		}
	}

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!nom_prenom.trim()) {
			newErrors.nom_prenom = 'Veuillez renseigner votre nom et prénom.';
		} else if (nom_prenom.trim().length < 2) {
			newErrors.nom_prenom = 'Le nom doit contenir au moins 2 caractères.';
		}

		const cleanPhone = telephone.replace(/\s+/g, '');
		if (!cleanPhone) {
			newErrors.telephone = 'Le numéro de téléphone est obligatoire.';
		} else if (!/^6\d{8}$/.test(cleanPhone)) {
			newErrors.telephone = 'Format camerounais attendu : 9 chiffres débutant par 6 (ex: 673 65 89 51).';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e: SubmitEvent) {
		if (!validate()) {
			e.preventDefault();
			return;
		}

		if (onsubmit) {
			e.preventDefault();
			await onsubmit({
				centre_pole,
				nom_prenom: nom_prenom.trim(),
				telephone: telephone.replace(/\s+/g, ''),
				sexe,
				statut_matrimonial,
				profession: profession.trim(),
				eglise: eglise.trim(),
				statut_classe: statut_classe_it,
				niveau_classe: statut_classe_it === 'Déjà dans une classe' ? niveau_classe : undefined
			});
		}
	}
</script>

<Card class="w-full max-w-lg mx-auto shadow-md">
	<form method="POST" action={actionUrl} onsubmit={handleSubmit} class="flex flex-col gap-5">
		<!-- Centre ou Pôle -->
		<Select
			id="centre_pole"
			name="centre_pole"
			label="Centre ou pôle"
			bind:value={centre_pole}
			options={[
				{ value: 'Bafoussam', label: 'Centre de Bafoussam (Pôle Ouest)' },
				{ value: 'Yaoundé - Mvog-Ada', label: 'Centre de Yaoundé (Siège)' },
				{ value: 'Douala', label: 'Centre de Douala (Pôle Littoral)' }
			]}
			required
		/>

		<!-- Noms et prénoms -->
		{#snippet userIcon()}
			<User class="w-5 h-5 text-slate-400" />
		{/snippet}
		<Input
			id="nom_prenom"
			name="nom_prenom"
			label="Noms et prénoms"
			placeholder="ex: Falonne Aragones"
			bind:value={nom_prenom}
			onblur={handleNameBlur}
			autocapitalize="words"
			autocomplete="name"
			required
			error={errors.nom_prenom}
			icon={userIcon}
		/>

		<!-- Choix du Sexe -->
		<PillSelector
			name="sexe"
			label="Sexe"
			bind:value={sexe}
			options={[
				{ value: 'Masculin', label: 'Homme / Masculin' },
				{ value: 'Féminin', label: 'Femme / Féminin' }
			]}
			required
		/>

		<!-- Numéro de Téléphone -->
		{#snippet phoneIcon()}
			<Phone class="w-5 h-5 text-slate-400" />
		{/snippet}
		<Input
			id="telephone"
			name="telephone"
			label="Numéro de téléphone"
			placeholder="6xx xxx xxx"
			bind:value={telephone}
			oninput={handlePhoneInput}
			inputmode="numeric"
			autocomplete="tel"
			required
			error={errors.telephone}
			helperText="Standard Cameroun (9 chiffres)"
			icon={phoneIcon}
		/>

		<!-- Statut matrimonial (sans "Autre") -->
		<PillSelector
			name="statut_matrimonial"
			label="Statut matrimonial"
			bind:value={statut_matrimonial}
			options={['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)']}
			required
		/>

		<!-- Situation vis-à-vis des classes IT -->
		<PillSelector
			name="statut_classe_it"
			label="Situation vis-à-vis des classes IT"
			bind:value={statut_classe_it}
			options={[
				{ value: 'Non', label: 'Non inscrit(e)' },
				{ value: 'Oui', label: 'Souhaite intégrer' },
				{ value: 'Déjà dans une classe', label: 'Déjà en classe' }
			]}
			required
		/>

		<!-- Champ conditionnel : Classe correspondante si déjà en classe -->
		{#if statut_classe_it === 'Déjà dans une classe'}
			<div class="bg-[#e8f5ee]/70 border border-[#00923f]/25 rounded-2xl p-4 flex flex-col gap-2 transition-all">
				<div class="flex items-center gap-1.5 text-xs font-bold text-[#006b2e]">
					<GraduationCap class="w-4 h-4 text-[#00923f]" />
					<span>Précisez votre classe IT actuelle :</span>
				</div>

				<PillSelector
					name="niveau_classe"
					bind:value={niveau_classe}
					options={[
						{ value: 'Initiation', label: 'Initiation', desc: '1er niveau' },
						{ value: 'Modelage', label: 'Modelage', desc: '2ème niveau' },
						{ value: 'Impact', label: 'Impact', desc: '3ème niveau' }
					]}
					required
				/>
			</div>
		{/if}

		<!-- Profession avec suggestions dynamiques -->
		{#snippet briefcaseIcon()}
			<Briefcase class="w-5 h-5 text-slate-400" />
		{/snippet}
		<div class="flex flex-col gap-1.5">
			<Input
				id="profession"
				name="profession"
				label="Profession / Activité"
				placeholder="ex: Enseignante, Commerçant, Étudiant..."
				bind:value={profession}
				icon={briefcaseIcon}
				list="profession-list"
			/>
			<datalist id="profession-list">
				{#each professionSuggestions as sug}
					<option value={sug}></option>
				{/each}
			</datalist>
		</div>

		<!-- Assemblée chrétienne -->
		{#snippet churchIcon()}
			<Church class="w-5 h-5 text-slate-400" />
		{/snippet}
		<Input
			id="eglise"
			name="eglise"
			label="Assemblée / Église fréquentée"
			placeholder="ex: Catholique, EEC, Évangélique, Baptiste..."
			bind:value={eglise}
			icon={churchIcon}
			helperText="Optionnel — paroisse ou communauté habituelle"
		/>

		<!-- Bouton d'envoi vert large -->
		<div class="pt-2">
			<Button
				type="submit"
				variant="primary"
				size="lg"
				fullWidth
				{loading}
			>
				{#snippet children()}
					<CheckCircle class="w-5 h-5 mr-1.5" />
					<span>Enregistrer mes coordonnées</span>
				{/snippet}
			</Button>
		</div>

		<p class="text-xs text-center text-slate-400 mt-1">
			Vos données restent strictement confidentielles et utilisées uniquement par l'Institut Tyrannus.
		</p>
	</form>
</Card>
