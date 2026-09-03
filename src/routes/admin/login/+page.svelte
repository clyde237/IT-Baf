<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { Lock, ArrowLeft, ShieldCheck, Eye, EyeOff } from '@lucide/svelte';

	let { form } = $props();

	let password = $state('');
	let showPassword = $state(false);
</script>

<svelte:head>
	<title>Connexion Administration — Institut Tyrannus Bafoussam</title>
</svelte:head>

<div class="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
	<div class="w-full max-w-md flex flex-col gap-6">
		<!-- Header Logo -->
		<div class="flex flex-col items-center text-center gap-3">
			<div class="w-16 h-16 rounded-2xl bg-white shadow-xs border border-slate-200/80 p-2 flex items-center justify-center">
				<img src="/logo_IT.png" alt="Logo Institut Tyrannus" class="w-full h-full object-contain" />
			</div>
			<div>
				<span class="text-xs font-bold uppercase tracking-wider text-[#00923f]">Sécurité & Console</span>
				<h1 class="text-2xl font-black text-slate-900">Institut Tyrannus</h1>
				<p class="text-xs text-slate-500 mt-0.5">Centre de Bafoussam • Pôle Ouest</p>
			</div>
		</div>

		<!-- Card Form -->
		<Card class="shadow-lg border-slate-200/80">
			<form method="POST" action="?/login" class="flex flex-col gap-5">
				<div class="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
					<Lock class="w-4 h-4 text-[#00923f]" />
					<span>Authentification Responsable</span>
				</div>

				{#if form?.error}
					<div class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
						{form.error}
					</div>
				{/if}

				<div class="relative flex flex-col gap-1.5">
					<label for="password" class="text-xs font-semibold uppercase tracking-wider text-slate-700">
						Mot de passe d'accès
					</label>

					<div class="relative flex items-center">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="Entrez le mot de passe admin..."
							bind:value={password}
							required
							class="w-full bg-white text-slate-900 border border-slate-300 focus:border-[#00923f] focus:ring-3 focus:ring-[#00923f]/25 rounded-xl px-3.5 py-3 text-sm min-h-[46px] outline-none transition-all pr-11"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
						>
							{#if showPassword}
								<EyeOff class="w-4 h-4" />
							{:else}
								<Eye class="w-4 h-4" />
							{/if}
						</button>
					</div>
				</div>

				<Button
					type="submit"
					variant="primary"
					size="lg"
					fullWidth
				>
					{#snippet children()}
						<ShieldCheck class="w-5 h-5 mr-1" />
						<span>Accéder au Répertoire</span>
					{/snippet}
				</Button>

				<div class="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-[11px] text-[#006b2e] leading-relaxed">
					ℹ️ <strong>Accès par défaut :</strong> <code class="font-mono font-bold bg-white px-1 py-0.5 rounded border border-emerald-200">Tyrannus2026@</code> (modifiable dans <code class="font-mono">.env</code> avec <code class="font-mono">ADMIN_PASSWORD</code>).
				</div>
			</form>
		</Card>

		<!-- Back to public form -->
		<a
			href="/"
			class="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#00923f] transition-colors"
		>
			<ArrowLeft class="w-3.5 h-3.5" />
			<span>Retour au formulaire public de recensement</span>
		</a>
	</div>
</div>
