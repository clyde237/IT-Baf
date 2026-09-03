<script lang="ts">
	import PublicHeader from '$lib/components/public/PublicHeader.svelte';
	import RegistrationForm from '$lib/components/public/RegistrationForm.svelte';
	import { Shield, Sparkles } from '@lucide/svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Recensement des Contacts — Institut Tyrannus Bafoussam</title>
	<meta name="description" content="Formulaire officiel de recensement des participants et membres de l'Institut Tyrannus au Centre de Bafoussam." />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
</svelte:head>

<main class="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between py-6 px-4 sm:px-6">
	<div class="w-full max-w-xl mx-auto flex flex-col gap-4">
		<!-- En-tête accueillant avec logo IT -->
		<PublicHeader />

		{#if data?.totalContacts > 0}
			<div class="text-center -mt-2 mb-1">
				<span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#e8f5ee] text-[#006b2e] border border-[#c2e7d0] shadow-2xs">
					<Sparkles class="w-3.5 h-3.5" />
					<span>{data.totalContacts} personnes déjà recensées au Centre</span>
				</span>
			</div>
		{/if}

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-2xl text-center font-medium">
				{form.error}
			</div>
		{/if}

		<!-- Formulaire Public Mobile de Recensement -->
		<RegistrationForm actionUrl="?/register" />
	</div>

	<!-- Footer discret avec lien vers la console administration -->
	<footer class="mt-10 py-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-2 border-t border-slate-200/60 max-w-lg mx-auto w-full">
		<span>© 2026 Institut Tyrannus — Centre de Bafoussam</span>
		<span class="hidden sm:inline">•</span>
		<a
			href="/admin/login"
			class="inline-flex items-center gap-1 text-slate-500 hover:text-[#00923f] transition-colors py-1 px-2 rounded-lg hover:bg-slate-100"
		>
			<Shield class="w-3.5 h-3.5" />
			<span>Espace Administration</span>
		</a>
	</footer>
</main>
