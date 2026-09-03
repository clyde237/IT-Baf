<script lang="ts">
	import type { Contact } from '$lib/types/contact';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import PillSelector from '$lib/components/ui/PillSelector.svelte';
	import { X, Phone, MessageCircle, Trash2, Check, GraduationCap } from '@lucide/svelte';

	interface Props {
		contact: Contact | null;
		isOpen: boolean;
		onClose: () => void;
		onUpdated?: (updated: Contact) => void;
		onDeleted?: (id: string) => void;
	}

	let { contact, isOpen, onClose, onUpdated, onDeleted }: Props = $props();

	let nom_prenom = $state('');
	let telephone = $state('');
	let centre_pole = $state('Bafoussam');
	let sexe = $state('Masculin');
	let statut_matrimonial = $state('Célibataire');
	let eglise = $state('');
	let profession = $state('');
	let statut_classe_it = $state('Non');
	let niveau_classe = $state('Initiation');

	let saving = $state(false);
	let deleting = $state(false);
	let errorMsg = $state('');

	$effect(() => {
		if (contact) {
			nom_prenom = contact.nom_prenom;
			telephone = contact.telephone;
			centre_pole = contact.centre_pole || 'Bafoussam';
			sexe = contact.sexe || 'Masculin';
			statut_matrimonial = contact.statut_matrimonial || 'Célibataire';
			eglise = contact.eglise || '';
			profession = contact.profession || '';
			statut_classe_it = contact.statut_classe || contact.statut_classe_it || 'Non';
			niveau_classe = contact.niveau_classe || 'Initiation';
			errorMsg = '';
		}
	});

	function getWhatsAppLink(rawPhone: string, name: string): string {
		let num = rawPhone.replace(/[^\d+]/g, '');
		if (/^6\d{8}$/.test(num)) num = `237${num}`;
		const message = encodeURIComponent(`Bonjour ${name}, Institut Tyrannus Bafoussam vous contacte.`);
		return `https://wa.me/${num}?text=${message}`;
	}

	async function handleSave() {
		if (!contact) return;
		saving = true;
		errorMsg = '';

		try {
			const res = await fetch(`/api/contacts/${contact.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nom_prenom,
					telephone,
					centre_pole,
					sexe,
					statut_matrimonial,
					eglise,
					profession,
					statut_classe: statut_classe_it,
					niveau_classe: statut_classe_it === 'Déjà dans une classe' ? niveau_classe : null
				})
			});

			if (!res.ok) {
				const json = await res.json();
				throw new Error(json.error || 'Erreur lors de la sauvegarde.');
			}

			const updated = await res.json();
			if (onUpdated) onUpdated(updated);
			onClose();
		} catch (err: any) {
			errorMsg = err.message || 'Échec de la mise à jour.';
		} finally {
			saving = false;
		}
	}

	async function handleDelete() {
		if (!contact) return;
		if (!confirm(`Supprimer définitivement la fiche de ${contact.nom_prenom} ?`)) return;

		deleting = true;
		try {
			const res = await fetch(`/api/contacts/${contact.id}`, {
				method: 'DELETE'
			});

			if (!res.ok) {
				const json = await res.json();
				throw new Error(json.error || 'Erreur lors de la suppression.');
			}

			if (onDeleted) onDeleted(contact.id);
			onClose();
		} catch (err: any) {
			errorMsg = err.message || 'Échec de la suppression.';
		} finally {
			deleting = false;
		}
	}
</script>

{#if isOpen && contact}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
		<div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
			<!-- Modal Header -->
			<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
				<div class="flex flex-col">
					<span class="text-xs font-bold uppercase tracking-wider text-[#00923f]">Fiche Contact</span>
					<h3 class="text-lg font-extrabold text-slate-900">{contact.nom_prenom}</h3>
				</div>
				<button
					type="button"
					onclick={onClose}
					class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Direct Contact Buttons -->
			<div class="px-6 py-3 bg-[#e8f5ee]/40 border-b border-emerald-100 flex items-center gap-3">
				<a
					href="tel:{contact.telephone.replace(/[^\d+]/g, '')}"
					class="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-[#00923f]/30 text-[#006b2e] font-semibold text-xs shadow-2xs hover:bg-[#e8f5ee] transition-colors"
				>
					<Phone class="w-4 h-4 text-[#00923f]" />
					<span>Appeler ({contact.telephone})</span>
				</a>

				<a
					href={getWhatsAppLink(contact.telephone, contact.nom_prenom)}
					target="_blank"
					rel="noopener noreferrer"
					class="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#00923f] text-white font-semibold text-xs shadow-xs hover:bg-[#006b2e] transition-colors"
				>
					<MessageCircle class="w-4 h-4" />
					<span>WhatsApp</span>
				</a>
			</div>

			<!-- Modal Body (Editable fields) -->
			<div class="p-6 overflow-y-auto flex flex-col gap-4">
				{#if errorMsg}
					<div class="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
						{errorMsg}
					</div>
				{/if}

				<Input
					label="Noms et Prénoms"
					bind:value={nom_prenom}
					required
				/>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Input
						label="Numéro de Téléphone"
						bind:value={telephone}
						required
					/>

					<PillSelector
						label="Sexe"
						bind:value={sexe}
						options={['Masculin', 'Féminin']}
					/>
				</div>

				<PillSelector
					label="Situation vis-à-vis des classes IT"
					bind:value={statut_classe_it}
					options={[
						{ value: 'Non', label: 'Non' },
						{ value: 'Oui', label: 'Oui (Souhaite)' },
						{ value: 'Déjà dans une classe', label: 'Déjà en classe' }
					]}
				/>

				{#if statut_classe_it === 'Déjà dans une classe'}
					<div class="bg-[#e8f5ee]/70 border border-[#00923f]/25 rounded-2xl p-3 flex flex-col gap-2">
						<div class="flex items-center gap-1.5 text-xs font-bold text-[#006b2e]">
							<GraduationCap class="w-4 h-4 text-[#00923f]" />
							<span>Niveau de classe IT :</span>
						</div>
						<PillSelector
							bind:value={niveau_classe}
							options={[
								{ value: 'Initiation', label: 'Initiation' },
								{ value: 'Modelage', label: 'Modelage' },
								{ value: 'Impact', label: 'Impact' }
							]}
						/>
					</div>
				{/if}

				<PillSelector
					label="Statut matrimonial"
					bind:value={statut_matrimonial}
					options={['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)']}
				/>

				<Input
					label="Assemblée / Église"
					bind:value={eglise}
					placeholder="ex: EEC, Catholique, Évangélique..."
				/>

				<Input
					label="Profession / Activité"
					bind:value={profession}
					placeholder="ex: Enseignant, Commerçant..."
				/>

				<Select
					label="Centre / Pôle"
					bind:value={centre_pole}
					options={[
						{ value: 'Bafoussam', label: 'Centre de Bafoussam (Pôle Ouest)' },
						{ value: 'Yaoundé - Mvog-Ada', label: 'Centre de Yaoundé' },
						{ value: 'Douala', label: 'Centre de Douala' }
					]}
				/>
			</div>

			<!-- Modal Footer -->
			<div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
				<button
					type="button"
					onclick={handleDelete}
					disabled={deleting}
					class="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer"
				>
					<Trash2 class="w-4 h-4" />
					<span>Supprimer</span>
				</button>

				<div class="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onclick={onClose}
					>
						{#snippet children()}
							<span>Fermer</span>
						{/snippet}
					</Button>

					<Button
						variant="primary"
						size="sm"
						loading={saving}
						onclick={handleSave}
					>
						{#snippet children()}
							<Check class="w-4 h-4 mr-1" />
							<span>Enregistrer</span>
						{/snippet}
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
