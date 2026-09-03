<script lang="ts">
	interface Props {
		title?: string;
		subtitle?: string;
		description?: string;
	}

	let {
		title = 'Recensement des Contacts',
		subtitle = 'Institut Tyrannus — Centre de Bafoussam',
		description = 'Bienvenue ! Veuillez renseigner vos coordonnées en moins d’une minute pour rester informé(e) de nos programmes et classes.'
	}: Props = $props();
</script>

<header class="flex flex-col items-center text-center gap-3 py-6 px-4 max-w-md mx-auto">
	<div class="relative w-20 h-20 sm:w-24 sm:h-24 p-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center transition-transform hover:scale-105">
		<img
			src="/logo_IT.png"
			alt="Logo Institut Tyrannus"
			class="w-full h-full object-contain"
			loading="eager"
		/>
	</div>

	<div class="flex flex-col gap-1 mt-1">
		<span class="text-xs font-bold tracking-widest text-[#00923f] uppercase">
			{subtitle}
		</span>
		<h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
			{title}
		</h1>
	</div>

	<p class="text-sm text-slate-600 leading-relaxed max-w-sm">
		{description}
	</p>
</header>
