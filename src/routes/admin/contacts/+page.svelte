<script lang="ts">
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import ContactFilters from '$lib/components/admin/ContactFilters.svelte';
	import ContactTable from '$lib/components/admin/ContactTable.svelte';
	import ContactDetailModal from '$lib/components/admin/ContactDetailModal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Contact } from '$lib/types/contact';
	import { goto } from '$app/navigation';
	import { Users, GraduationCap, Sparkles, UserPlus, Upload, Download } from '@lucide/svelte';

	let { data } = $props();

	let selectedContact = $state<Contact | null>(null);
	let isModalOpen = $state(false);

	let searchQuery = $state('');
	let selectedClasse = $state('all');
	let selectedMatrimonial = $state('all');

	$effect(() => {
		searchQuery = data.filters.query;
		selectedClasse = data.filters.statut_classe_it;
		selectedMatrimonial = data.filters.statut_matrimonial;
	});

	function updateQueryParams() {
		const params = new URLSearchParams();
		if (searchQuery.trim()) params.set('q', searchQuery.trim());
		if (selectedClasse !== 'all') params.set('classe', selectedClasse);
		if (selectedMatrimonial !== 'all') params.set('matrimonial', selectedMatrimonial);
		params.set('page', '1');

		goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	function handlePageChange(newPage: number) {
		const params = new URLSearchParams(window.location.search);
		params.set('page', newPage.toString());
		goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	function handleResetFilters() {
		searchQuery = '';
		selectedClasse = 'all';
		selectedMatrimonial = 'all';
		goto('?page=1', { keepFocus: true, noScroll: true });
	}

	function openContactDetail(c: Contact) {
		selectedContact = c;
		isModalOpen = true;
	}

	function handleContactUpdated(updated: Contact) {
		const idx = data.contacts.findIndex((c) => c.id === updated.id);
		if (idx !== -1) {
			data.contacts[idx] = updated;
		}
	}

	function handleContactDeleted(id: string) {
		data.contacts = data.contacts.filter((c) => c.id !== id);
		data.total = Math.max(0, data.total - 1);
	}
</script>

<svelte:head>
	<title>Répertoire des Contacts — IT Bafoussam</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 sm:pb-8 flex flex-col gap-5 sm:gap-6">
	<!-- Top Bar / Title & Action Buttons -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
		<div>
			<h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
				Répertoire & Contacts
			</h1>
			<p class="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
				Suivi des participants et apprenants • Centre de Bafoussam
			</p>
		</div>

		<div class="flex items-center gap-2 w-full sm:w-auto">
			<div class="flex-1 sm:flex-none">
				<Button
					href="/admin/sync"
					variant="outline"
					size="sm"
					fullWidth
				>
					{#snippet children()}
						<Upload class="w-4 h-4 text-slate-500 mr-1" />
						<span>Importer</span>
					{/snippet}
				</Button>
			</div>

			<div class="flex-1 sm:flex-none">
				<Button
					href="/api/export"
					variant="primary"
					size="sm"
					fullWidth
				>
					{#snippet children()}
						<Download class="w-4 h-4 mr-1" />
						<span>Exporter (.xlsx)</span>
					{/snippet}
				</Button>
			</div>
		</div>
	</div>

	<!-- Dashboard Stat Cards (2 columns on mobile, 4 on desktop) -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
		<StatCard
			title="Total Inscrits"
			value={data.stats.total}
			subtitle="Tous contacts"
			icon={Users}
			variant="it"
		/>

		<StatCard
			title="Déjà en Classe"
			value={data.stats.enClasse}
			subtitle="Apprenants"
			icon={GraduationCap}
			variant="slate"
		/>

		<StatCard
			title="Souhaitent Intégrer"
			value={data.stats.souhaiteClasse}
			subtitle="Prospects"
			icon={Sparkles}
			variant="blue"
		/>

		<StatCard
			title="Aujourd'hui"
			value={data.stats.derniersInscritsAujourdhui}
			subtitle="Nouveaux"
			icon={UserPlus}
			variant="amber"
		/>
	</div>

	<!-- Filters & Search -->
	<ContactFilters
		bind:searchQuery
		bind:selectedClasse
		bind:selectedMatrimonial
		onSearch={() => updateQueryParams()}
		onClasseChange={() => updateQueryParams()}
		onMatrimonialChange={() => updateQueryParams()}
		onReset={handleResetFilters}
	/>

	<!-- Table of Contacts -->
	<ContactTable
		contacts={data.contacts}
		total={data.total}
		currentPage={data.page}
		totalPages={data.totalPages}
		onPageChange={handlePageChange}
		onSelectContact={openContactDetail}
	/>
</div>

<!-- Modal detail / edit -->
<ContactDetailModal
	contact={selectedContact}
	isOpen={isModalOpen}
	onClose={() => { isModalOpen = false; selectedContact = null; }}
	onUpdated={handleContactUpdated}
	onDeleted={handleContactDeleted}
/>
