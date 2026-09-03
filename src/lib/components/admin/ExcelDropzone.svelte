<script lang="ts">
	import { UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle, RefreshCw, FileCheck } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		onUploadSuccess?: (result: { added: number; updated: number; totalProcessed: number }) => void;
	}

	let { onUploadSuccess }: Props = $props();

	let isDragging = $state(false);
	let selectedFile = $state<File | null>(null);
	let uploading = $state(false);
	let uploadStatus = $state<{
		success: boolean;
		message: string;
		added?: number;
		updated?: number;
	} | null>(null);

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
			handleFile(e.dataTransfer.files[0]);
		}
	}

	function handleFileInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (e.currentTarget.files && e.currentTarget.files.length > 0) {
			handleFile(e.currentTarget.files[0]);
		}
	}

	function handleFile(file: File) {
		if (
			file.name.endsWith('.xlsx') ||
			file.name.endsWith('.xls') ||
			file.type.includes('spreadsheet') ||
			file.type.includes('excel')
		) {
			selectedFile = file;
			uploadStatus = null;
		} else {
			uploadStatus = {
				success: false,
				message: 'Format de fichier non pris en charge. Veuillez fournir un fichier .xlsx ou .xls.'
			};
		}
	}

	async function submitImport() {
		if (!selectedFile) return;

		uploading = true;
		uploadStatus = null;

		const formData = new FormData();
		formData.append('file', selectedFile);

		try {
			const res = await fetch('/api/import', {
				method: 'POST',
				body: formData
			});

			const json = await res.json();

			if (!res.ok) {
				throw new Error(json.error || "Erreur lors de l'importation.");
			}

			uploadStatus = {
				success: true,
				message: json.message,
				added: json.added,
				updated: json.updated
			};

			if (onUploadSuccess) {
				onUploadSuccess({
					added: json.added,
					updated: json.updated,
					totalProcessed: (json.added || 0) + (json.updated || 0)
				});
			}

			selectedFile = null;
		} catch (err: any) {
			uploadStatus = {
				success: false,
				message: err.message || "Échec de l'analyse du classeur Excel."
			};
		} finally {
			uploading = false;
		}
	}
</script>

<div class="flex flex-col gap-5">
	<!-- Drag & Drop container -->
	<div
		role="region"
		aria-label="Zone de glisser-déposer de classeur Excel"
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		class="relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer {isDragging
			? 'border-[#00923f] bg-emerald-50/50 scale-[1.01]'
			: 'border-slate-300 hover:border-[#00923f] bg-slate-50/40 hover:bg-slate-50'}"
	>
		<input
			type="file"
			accept=".xlsx, .xls"
			onchange={handleFileInput}
			class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
		/>

		<div class="flex flex-col items-center justify-center gap-3">
			<div class="w-16 h-16 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-[#00923f]">
				{#if selectedFile}
					<FileCheck class="w-8 h-8 text-[#00923f]" />
				{:else}
					<UploadCloud class="w-8 h-8 text-slate-400 group-hover:text-[#00923f]" />
				{/if}
			</div>

			<div class="flex flex-col gap-1">
				{#if selectedFile}
					<span class="text-sm font-bold text-slate-900">{selectedFile.name}</span>
					<span class="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} Ko • Prêt pour l'analyse</span>
				{:else}
					<p class="text-sm font-bold text-slate-800">
						Glissez-déposez votre fichier Excel ici, ou <span class="text-[#00923f] underline">parcourez</span>
					</p>
					<p class="text-xs text-slate-500">
						Fichiers supportés : .xlsx, .xls (inclut les classeurs avec décalage de colonnes comme <code class="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">Contacts Baf.xlsx</code>)
					</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Action button if file is selected -->
	{#if selectedFile}
		<div class="flex items-center justify-end gap-2">
			<button
				type="button"
				onclick={() => { selectedFile = null; uploadStatus = null; }}
				class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
				disabled={uploading}
			>
				Annuler
			</button>

			<Button
				variant="primary"
				size="md"
				onclick={submitImport}
				loading={uploading}
			>
				{#snippet children()}
					<RefreshCw class="w-4 h-4 {uploading ? 'animate-spin' : ''}" />
					<span>Lancer la synchronisation & l'alignement</span>
				{/snippet}
			</Button>
		</div>
	{/if}

	<!-- Upload feedback banner -->
	{#if uploadStatus}
		<div class="p-4 rounded-xl flex items-start gap-3 text-sm {uploadStatus.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'}">
			{#if uploadStatus.success}
				<CheckCircle class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
				<div class="flex flex-col gap-1">
					<span class="font-bold">{uploadStatus.message}</span>
					<div class="flex items-center gap-3 text-xs text-emerald-700">
						<span>✨ Nouveaux contacts ajoutés : <strong>{uploadStatus.added ?? 0}</strong></span>
						<span>🔄 Fiches mises à jour (doublons) : <strong>{uploadStatus.updated ?? 0}</strong></span>
					</div>
				</div>
			{:else}
				<AlertCircle class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
				<span class="font-medium">{uploadStatus.message}</span>
			{/if}
		</div>
	{/if}
</div>
