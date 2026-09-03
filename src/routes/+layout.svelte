<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/logo_IT.png" />
	<link rel="apple-touch-icon" href="/logo_IT.png" />
</svelte:head>

{@render children()}
