<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { UserPlus, ArrowRight } from '@lucide/svelte';

	interface Props {
		name?: string;
		onReset?: () => void;
	}

	let { name, onReset }: Props = $props();
</script>

<Card class="w-full max-w-md mx-auto text-center flex flex-col items-center gap-6 py-8 px-6 shadow-md animate-fade-in">
	<!-- Animated Green Check Circle -->
	<div class="relative flex items-center justify-center">
		<div class="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center text-[#00923f] animate-pulse">
			<svg
				class="w-10 h-10 stroke-current"
				viewBox="0 0 24 24"
				fill="none"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="20 6 9 17 4 12"></polyline>
			</svg>
		</div>
		<div class="absolute inset-0 rounded-full border-2 border-[#00923f] opacity-20 animate-ping"></div>
	</div>

	<div class="flex flex-col gap-2">
		<span class="text-xs font-bold uppercase tracking-wider text-[#00923f]">Enregistrement réussi</span>
		<h2 class="text-2xl font-extrabold text-slate-900">
			{#if name}
				Merci {name} !
			{:else}
				Merci beaucoup !
			{/if}
		</h2>
		<p class="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
			Vos coordonnées ont été enregistrées avec succès au <span class="font-semibold text-slate-800">Centre de Bafoussam</span>. L'équipe de l'Institut Tyrannus vous remercie et vous contactera très prochainement !
		</p>
	</div>

	<div class="w-full pt-2 flex flex-col gap-3">
		<Button
			href="/"
			variant="primary"
			size="lg"
			fullWidth
			onclick={onReset}
		>
			{#snippet children()}
				<UserPlus class="w-5 h-5 mr-1" />
				<span>Enregistrer un autre contact</span>
			{/snippet}
		</Button>

		<a
			href="/admin/login"
			class="inline-flex items-center justify-center text-xs text-slate-400 hover:text-slate-600 transition-colors py-1 gap-1"
		>
			<span>Accès console administration</span>
			<ArrowRight class="w-3.5 h-3.5" />
		</a>
	</div>
</Card>
