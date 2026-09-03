<script lang="ts">
	import SuccessCard from '$lib/components/public/SuccessCard.svelte';
	import { page } from '$app/state';

	const nom = $derived(page.url.searchParams.get('nom') || '');
</script>

<svelte:head>
	<title>Inscription Confirmée — Institut Tyrannus Bafoussam</title>
</svelte:head>

<main class="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
	<div class="w-full max-w-md">
		<SuccessCard name={nom} />
	</div>
</main>
