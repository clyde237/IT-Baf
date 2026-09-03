<script lang="ts">
	import { Search, X, Download, Filter } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		searchQuery?: string;
		selectedClasse?: string;
		selectedMatrimonial?: string;
		onSearch?: (query: string) => void;
		onClasseChange?: (val: string) => void;
		onMatrimonialChange?: (val: string) => void;
		onReset?: () => void;
	}

	let {
		searchQuery = $bindable(''),
		selectedClasse = $bindable('all'),
		selectedMatrimonial = $bindable('all'),
		onSearch,
		onClasseChange,
		onMatrimonialChange,
		onReset
	}: Props = $props();

	let debounceTimeout: ReturnType<typeof setTimeout> | undefined;

	function handleInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		searchQuery = e.currentTarget.value;
		if (debounceTimeout) clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			if (onSearch) onSearch(searchQuery);
		}, 300);
	}

	function handleClasseSelect(e: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		selectedClasse = e.currentTarget.value;
		if (onClasseChange) onClasseChange(selectedClasse);
	}

	function handleMatrimonialSelect(e: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		selectedMatrimonial = e.currentTarget.value;
		if (onMatrimonialChange) onMatrimonialChange(selectedMatrimonial);
	}

	function clearSearch() {
		searchQuery = '';
		if (onSearch) onSearch('');
	}

	const hasActiveFilters = $derived(
		searchQuery.trim() !== '' || selectedClasse !== 'all' || selectedMatrimonial !== 'all'
	);
</script>

<div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
	<!-- Search Box -->
	<div class="relative flex-1">
		<div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
			<Search class="w-4 h-4" />
		</div>
		<input
			type="text"
			placeholder="Rechercher par nom, téléphone, église ou profession..."
			value={searchQuery}
			oninput={handleInput}
			class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-[#00923f] focus:ring-2 focus:ring-[#00923f]/20"
		/>
		{#if searchQuery}
			<button
				type="button"
				onclick={clearSearch}
				class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
			>
				<X class="w-3.5 h-3.5" />
			</button>
		{/if}
	</div>

	<!-- Dropdown Filters -->
	<div class="flex flex-wrap sm:flex-nowrap items-center gap-2">
		<div class="w-full sm:w-auto flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-600">
			<Filter class="w-3.5 h-3.5 text-slate-400 shrink-0" />
			<select
				value={selectedClasse}
				onchange={handleClasseSelect}
				class="bg-transparent text-slate-700 font-medium outline-none cursor-pointer pr-4"
			>
				<option value="all">Toutes classes IT</option>
				<option value="Déjà dans une classe">Déjà dans une classe</option>
				<option value="Oui">Souhaite intégrer (Oui)</option>
				<option value="Non">Non inscrit (Non)</option>
			</select>
		</div>

		<div class="w-full sm:w-auto flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-600">
			<select
				value={selectedMatrimonial}
				onchange={handleMatrimonialSelect}
				class="bg-transparent text-slate-700 font-medium outline-none cursor-pointer pr-4"
			>
				<option value="all">Tous statuts civils</option>
				<option value="Célibataire">Célibataire</option>
				<option value="Marié(e)">Marié(e)</option>
				<option value="Divorcé(e)/séparé(e)">Divorcé(e)</option>
				<option value="Veuf(ve)">Veuf(ve)</option>
			</select>
		</div>

		{#if hasActiveFilters}
			<button
				type="button"
				onclick={onReset}
				class="px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
			>
				Réinitialiser
			</button>
		{/if}

		<a
			href="/api/export"
			download
			class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#006b2e] text-white rounded-xl text-xs font-bold hover:bg-[#005223] transition-all shadow-xs shrink-0 cursor-pointer"
			title="Exporter la liste complète au format Excel selon la charte IT"
		>
			<Download class="w-3.5 h-3.5" />
			<span>Exporter Excel</span>
		</a>
	</div>
</div>
