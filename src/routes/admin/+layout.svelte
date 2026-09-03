<script lang="ts">
	import AdminNavbar from '$lib/components/admin/AdminNavbar.svelte';

	let { data, children } = $props();
</script>

<div class="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
	{#if data.authenticated}
		<AdminNavbar isNeon={data.isNeon} />
	{/if}

	<main class="flex-1 w-full">
		{@render children()}
	</main>
</div>
