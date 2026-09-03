<script lang="ts">
	import { Users, FileSpreadsheet, ExternalLink, LogOut, Database } from '@lucide/svelte';
	import { page } from '$app/state';

	interface Props {
		isNeon?: boolean;
	}

	let { isNeon = false }: Props = $props();

	const currentPath = $derived(page.url.pathname);
</script>

<!-- Top Desktop/Mobile Header -->
<nav class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Brand logo & title -->
			<div class="flex items-center gap-2 sm:gap-3">
				<a href="/admin/contacts" class="flex items-center gap-2.5 sm:gap-3 group">
					<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#e8f5ee] border border-[#00923f]/20 flex items-center justify-center p-1 overflow-hidden transition-transform group-hover:scale-105 shrink-0">
						<img src="/logo_IT.png" alt="Logo IT" class="w-full h-full object-contain" />
					</div>
					<div class="flex flex-col">
						<span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00923f]">Admin IT</span>
						<span class="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
							Bafoussam
							<span class="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#e8f5ee] text-[#006b2e]">Pôle Ouest</span>
						</span>
					</div>
				</a>
			</div>

			<!-- Desktop Navigation Links (>= sm) -->
			<div class="hidden sm:flex items-center gap-1.5 md:gap-2">
				<a
					href="/admin/contacts"
					class="px-3 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all {currentPath.startsWith('/admin/contacts')
						? 'bg-[#e8f5ee] text-[#006b2e]'
						: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
				>
					<Users class="w-4 h-4" />
					<span>Contacts</span>
				</a>

				<a
					href="/admin/sync"
					class="px-3 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all {currentPath.startsWith('/admin/sync')
						? 'bg-[#e8f5ee] text-[#006b2e]'
						: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
				>
					<FileSpreadsheet class="w-4 h-4" />
					<span>Import / Export</span>
				</a>

				<a
					href="/"
					target="_blank"
					class="px-2.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-[#00923f] hover:bg-slate-50 flex items-center gap-1 transition-colors"
					title="Ouvrir le formulaire public dans un nouvel onglet"
				>
					<ExternalLink class="w-3.5 h-3.5" />
					<span class="hidden lg:inline">Formulaire Public</span>
				</a>

				<!-- Neon status pill -->
				<div class="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium {isNeon ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}">
					<Database class="w-3.5 h-3.5" />
					<span>{isNeon ? 'Neon Postgres' : 'Stockage Local'}</span>
				</div>
			</div>

			<!-- Right actions: Status pill on mobile + Logout -->
			<div class="flex items-center gap-1.5 sm:gap-2">
				<div class="sm:hidden flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold {isNeon ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}">
					<span class="w-1.5 h-1.5 rounded-full {isNeon ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
					<span>Neon</span>
				</div>

				<form method="POST" action="/admin/login?/logout">
					<button
						type="submit"
						class="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
						title="Se déconnecter"
					>
						<LogOut class="w-4 h-4" />
					</button>
				</form>
			</div>
		</div>
	</div>
</nav>

<!-- Mobile Bottom Navigation Bar (Visible only on screens < sm) -->
<nav class="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-4 flex justify-around items-center shadow-lg safe-area-bottom">
	<a
		href="/admin/contacts"
		class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all {currentPath.startsWith('/admin/contacts')
			? 'text-[#00923f] font-bold'
			: 'text-slate-500 hover:text-slate-900 font-medium'}"
	>
		<Users class="w-5 h-5" />
		<span class="text-[10px]">Contacts</span>
	</a>

	<a
		href="/admin/sync"
		class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all {currentPath.startsWith('/admin/sync')
			? 'text-[#00923f] font-bold'
			: 'text-slate-500 hover:text-slate-900 font-medium'}"
	>
		<FileSpreadsheet class="w-5 h-5" />
		<span class="text-[10px]">Excel Sync</span>
	</a>

	<a
		href="/"
		target="_blank"
		class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-500 hover:text-[#00923f] transition-all font-medium"
	>
		<ExternalLink class="w-5 h-5" />
		<span class="text-[10px]">Formulaire</span>
	</a>
</nav>
