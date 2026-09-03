<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
	}

	let { children, class: className = '' }: Props = $props();
</script>

<div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 p-4.5 sm:p-7 {className}">
	{@render children?.()}
</div>
