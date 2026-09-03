<script lang="ts">
	import type { Contact } from '$lib/types/contact';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { Phone, MessageCircle, ChevronLeft, ChevronRight, User, Calendar, MapPin, Briefcase, Church } from '@lucide/svelte';

	interface Props {
		contacts: Contact[];
		total: number;
		currentPage: number;
		totalPages: number;
		onPageChange?: (page: number) => void;
		onSelectContact?: (contact: Contact) => void;
	}

	let {
		contacts = [],
		total = 0,
		currentPage = 1,
		totalPages = 1,
		onPageChange,
		onSelectContact
	}: Props = $props();

	function cleanPhoneNumber(raw: string): string {
		return raw.replace(/[^\d+]/g, '');
	}

	function getWhatsAppLink(rawPhone: string, name: string): string {
		let num = cleanPhoneNumber(rawPhone);
		if (/^6\d{8}$/.test(num)) {
			num = `237${num}`;
		}
		const message = encodeURIComponent(
			`Bonjour ${name}, nous vous contactons depuis le Centre de Bafoussam de l'Institut Tyrannus.`
		);
		return `https://wa.me/${num}?text=${message}`;
	}

	function getTelLink(rawPhone: string): string {
		const num = cleanPhoneNumber(rawPhone);
		return `tel:${num}`;
	}

	function formatDate(isoString: string): string {
		if (!isoString) return '—';
		try {
			const d = new Date(isoString);
			return d.toLocaleDateString('fr-FR', {
				day: '2-digit',
				month: 'short',
				year: 'numeric'
			});
		} catch {
			return isoString;
		}
	}
</script>

<div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
	<!-- Table Header / Count summary -->
	<div class="px-4 sm:px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
		<span class="font-medium">
			Affichage de <strong class="text-slate-800">{contacts.length}</strong> sur <strong class="text-slate-800">{total}</strong> contacts
		</span>
		<span class="font-medium text-slate-400 hidden sm:inline">
			Pôle Ouest — Bafoussam
		</span>
	</div>

	<!-- 1. MOBILE CARD VIEW (< md screens) -->
	<div class="block md:hidden divide-y divide-slate-100">
		{#if contacts.length === 0}
			<div class="py-12 px-4 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
				<User class="w-8 h-8 text-slate-300" />
				<span>Aucun contact trouvé pour cette recherche.</span>
			</div>
		{:else}
			{#each contacts as contact (contact.id)}
				<div class="p-4 flex flex-col gap-3 hover:bg-slate-50/60 transition-colors">
					<!-- Top Row: Name, Sex badge & Date -->
					<div class="flex items-start justify-between gap-2">
						<button
							type="button"
							onclick={() => onSelectContact && onSelectContact(contact)}
							class="text-left font-bold text-slate-900 text-base hover:text-[#00923f] transition-colors leading-snug cursor-pointer"
						>
							{contact.nom_prenom}
						</button>

						<div class="flex items-center gap-1.5 shrink-0">
							{#if contact.sexe}
								<span class="text-[10px] font-bold px-1.5 py-0.5 rounded {contact.sexe === 'Féminin' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}">
									{contact.sexe === 'Féminin' ? 'F' : 'M'}
								</span>
							{/if}
							<span class="text-[11px] text-slate-400 font-medium">
								{formatDate(contact.created_at)}
							</span>
						</div>
					</div>

					<!-- Middle Row: Classes IT status & Meta info -->
					<div class="flex flex-wrap items-center gap-2 text-xs">
						{#if contact.statut_classe === 'Déjà dans une classe' || contact.statut_classe_it === 'Déjà dans une classe'}
							<Badge variant="it">
								<span class="w-1.5 h-1.5 rounded-full bg-[#00923f]"></span>
								<span>En classe {#if contact.niveau_classe}• <strong>{contact.niveau_classe}</strong>{/if}</span>
							</Badge>
						{:else if contact.statut_classe === 'Oui' || contact.statut_classe_it === 'Oui'}
							<Badge variant="info">
								<span>Souhaite intégrer</span>
							</Badge>
						{:else}
							<Badge variant="neutral">
								<span>Non inscrit</span>
							</Badge>
						{/if}

						<span class="text-slate-400">•</span>
						<span class="text-slate-600 font-medium">{contact.statut_matrimonial || '—'}</span>

						{#if contact.eglise}
							<span class="text-slate-400">•</span>
							<span class="text-slate-500 inline-flex items-center gap-1">
								<Church class="w-3 h-3 text-slate-400" />
								{contact.eglise}
							</span>
						{/if}
					</div>

					<!-- Bottom Row: Phone Number & Large Touch Action Buttons -->
					<div class="flex items-center justify-between gap-2 pt-1">
						<span class="font-mono text-sm font-bold text-slate-800 tracking-wide">
							{contact.telephone}
						</span>

						<div class="flex items-center gap-2">
							<a
								href={getTelLink(contact.telephone)}
								class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-[#00923f] hover:bg-[#00923f] hover:text-white transition-all text-xs font-semibold shadow-2xs min-h-[40px]"
								title="Appeler directement {contact.nom_prenom}"
							>
								<Phone class="w-4 h-4" />
								<span>Appel</span>
							</a>

							<a
								href={getWhatsAppLink(contact.telephone, contact.nom_prenom)}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#00923f] text-white hover:bg-[#006b2e] transition-all text-xs font-semibold shadow-xs min-h-[40px]"
								title="Discussion WhatsApp"
							>
								<MessageCircle class="w-4 h-4" />
								<span>WhatsApp</span>
							</a>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- 2. DESKTOP TABLE VIEW (>= md screens) -->
	<div class="hidden md:block overflow-x-auto">
		<table class="w-full text-left border-collapse text-sm">
			<thead>
				<tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
					<th class="py-3 px-4">Contact</th>
					<th class="py-3 px-4">Téléphone & Actions</th>
					<th class="py-3 px-4">Classes IT</th>
					<th class="py-3 px-4">Statut civil</th>
					<th class="py-3 px-4">Assemblée / Église</th>
					<th class="py-3 px-4">Activité</th>
					<th class="py-3 px-4">Enregistré le</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#if contacts.length === 0}
					<tr>
						<td colspan="7" class="py-12 text-center text-slate-400 text-sm">
							<div class="flex flex-col items-center justify-center gap-2">
								<User class="w-8 h-8 text-slate-300" />
								<span>Aucun contact trouvé pour cette recherche.</span>
							</div>
						</td>
					</tr>
				{:else}
					{#each contacts as contact (contact.id)}
						<tr class="hover:bg-emerald-50/30 transition-colors group">
							<!-- Name, Sexe & Centre -->
							<td class="py-3.5 px-4">
								<div class="flex flex-col">
									<div class="flex items-center gap-1.5">
										<button
											type="button"
											onclick={() => onSelectContact && onSelectContact(contact)}
											class="text-left font-bold text-slate-900 group-hover:text-[#00923f] transition-colors cursor-pointer"
										>
											{contact.nom_prenom}
										</button>
										{#if contact.sexe}
											<span class="text-[10px] font-bold px-1.5 py-0.5 rounded {contact.sexe === 'Féminin' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}">
												{contact.sexe === 'Féminin' ? 'F' : 'M'}
											</span>
										{/if}
									</div>
									<span class="text-xs text-slate-400 flex items-center gap-1">
										<MapPin class="w-3 h-3" />
										{contact.centre_pole || 'Bafoussam'}
									</span>
								</div>
							</td>

							<!-- Phone & Direct Call / WhatsApp Links -->
							<td class="py-3.5 px-4">
								<div class="flex items-center gap-2">
									<span class="font-mono text-xs font-semibold text-slate-800 tracking-wide">
										{contact.telephone}
									</span>

									<!-- Direct Call Button -->
									<a
										href={getTelLink(contact.telephone)}
										class="p-1.5 rounded-lg bg-emerald-50 text-[#00923f] hover:bg-[#00923f] hover:text-white transition-all shadow-2xs"
										title="Appeler directement {contact.nom_prenom}"
									>
										<Phone class="w-3.5 h-3.5" />
									</a>

									<!-- Direct WhatsApp Button -->
									<a
										href={getWhatsAppLink(contact.telephone, contact.nom_prenom)}
										target="_blank"
										rel="noopener noreferrer"
										class="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-2xs"
										title="Ouvrir discussion WhatsApp avec {contact.nom_prenom}"
									>
										<MessageCircle class="w-3.5 h-3.5" />
									</a>
								</div>
							</td>

							<!-- Classes IT Status Badge & Level -->
							<td class="py-3.5 px-4">
								{#if contact.statut_classe === 'Déjà dans une classe' || contact.statut_classe_it === 'Déjà dans une classe'}
									<Badge variant="it">
										<span class="w-1.5 h-1.5 rounded-full bg-[#00923f]"></span>
										<span>
											En classe
											{#if contact.niveau_classe}
												• <strong class="underline decoration-[#00923f]/40">{contact.niveau_classe}</strong>
											{/if}
										</span>
									</Badge>
								{:else if contact.statut_classe === 'Oui' || contact.statut_classe_it === 'Oui'}
									<Badge variant="info">
										<span>Souhaite intégrer</span>
									</Badge>
								{:else}
									<Badge variant="neutral">
										<span>Non inscrit</span>
									</Badge>
								{/if}
							</td>

							<!-- Statut matrimonial -->
							<td class="py-3.5 px-4 text-xs text-slate-700 font-medium">
								{contact.statut_matrimonial || '—'}
							</td>

							<!-- Assemblée / Eglise -->
							<td class="py-3.5 px-4 text-xs text-slate-600">
								{contact.eglise || '—'}
							</td>

							<!-- Profession -->
							<td class="py-3.5 px-4 text-xs text-slate-600">
								{contact.profession || '—'}
							</td>

							<!-- Enregistré le -->
							<td class="py-3.5 px-4 text-xs text-slate-400 font-medium">
								{formatDate(contact.created_at)}
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Pagination footer -->
	{#if totalPages > 1}
		<div class="px-4 sm:px-5 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
			<span class="text-xs text-slate-500">
				Page <span class="font-bold text-slate-800">{currentPage}</span> sur <span class="font-bold text-slate-800">{totalPages}</span>
			</span>

			<div class="flex items-center gap-2">
				<button
					type="button"
					disabled={currentPage <= 1}
					onclick={() => onPageChange && onPageChange(currentPage - 1)}
					class="min-h-[40px] min-w-[40px] p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center"
					title="Page précédente"
				>
					<ChevronLeft class="w-4 h-4" />
				</button>

				<button
					type="button"
					disabled={currentPage >= totalPages}
					onclick={() => onPageChange && onPageChange(currentPage + 1)}
					class="min-h-[40px] min-w-[40px] p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center"
					title="Page suivante"
				>
					<ChevronRight class="w-4 h-4" />
				</button>
			</div>
		</div>
	{/if}
</div>
