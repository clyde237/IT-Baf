<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ExcelDropzone from '$lib/components/admin/ExcelDropzone.svelte';
	import { FileSpreadsheet, Download, Check, AlertTriangle, ShieldCheck, Database, Layers } from '@lucide/svelte';

	let { data } = $props();

	let importSuccessStats = $state<{ added: number; updated: number; totalProcessed: number } | null>(null);

	function handleUploadSuccess(result: { added: number; updated: number; totalProcessed: number }) {
		importSuccessStats = result;
		data.stats.total += result.added;
	}
</script>

<svelte:head>
	<title>Synchronisation Excel — IT Bafoussam</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 sm:pb-8 flex flex-col gap-6 sm:gap-8">
	<!-- Page Header -->
	<div class="flex flex-col gap-1">
		<span class="text-xs font-bold uppercase tracking-wider text-[#00923f]">Données & Exports</span>
		<h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
			Synchronisation & Gestion des Classeurs Excel
		</h1>
		<p class="text-sm text-slate-500">
			Importez des fichiers bruts ou historiques avec alignement automatique des colonnes, ou exportez l'ensemble de la base aux couleurs de l'Institut Tyrannus.
		</p>
	</div>

	<!-- 2-Columns layout -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
		<!-- Section 1 : Importation -->
		<Card class="flex flex-col gap-5 border-slate-200">
			<div class="flex items-center gap-2.5 pb-3 border-b border-slate-100">
				<div class="p-2 rounded-xl bg-emerald-50 text-[#00923f]">
					<FileSpreadsheet class="w-5 h-5" />
				</div>
				<div>
					<h2 class="text-base font-bold text-slate-900">Importation de fichier Excel</h2>
					<p class="text-xs text-slate-500">Moteur d'alignement intelligent et détection des doublons</p>
				</div>
			</div>

			<ExcelDropzone onUploadSuccess={handleUploadSuccess} />

			<div class="bg-slate-50 rounded-xl p-4 border border-slate-200/60 flex flex-col gap-2 text-xs text-slate-600">
				<div class="flex items-center gap-1.5 font-bold text-slate-800">
					<Layers class="w-4 h-4 text-[#00923f]" />
					<span>Compatibilité automatique des fichiers anciens :</span>
				</div>
				<p class="leading-relaxed">
					Le moteur détecte automatiquement le décalage historique des titres de colonnes du fichier <code class="bg-white px-1 py-0.5 rounded border font-mono">Contacts Baf.xlsx</code> et réassigne chaque valeur au champ cible adéquat (noms, téléphone camerounais, statut matrimonial, classe IT).
				</p>
			</div>
		</Card>

		<!-- Section 2 : Exportation -->
		<Card class="flex flex-col gap-5 border-slate-200">
			<div class="flex items-center gap-2.5 pb-3 border-b border-slate-100">
				<div class="p-2 rounded-xl bg-[#e8f5ee] text-[#006b2e]">
					<Download class="w-5 h-5" />
				</div>
				<div>
					<h2 class="text-base font-bold text-slate-900">Exportation Excel (.xlsx)</h2>
					<p class="text-xs text-slate-500">Classeur standardisé selon la charte graphique IT</p>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				<p class="text-sm text-slate-600 leading-relaxed">
					Téléchargez l'intégralité des <strong>{data.stats.total} contacts</strong> actuellement répertoriés dans la base. Le fichier généré est directement exploitable :
				</p>

				<ul class="flex flex-col gap-2 text-xs text-slate-600">
					<li class="flex items-center gap-2">
						<Check class="w-4 h-4 text-[#00923f] shrink-0" />
						<span>En-têtes stylisés en vert foncé institutionnel (<code class="bg-slate-100 px-1 rounded">#006b2e</code>) avec texte blanc gras.</span>
					</li>
					<li class="flex items-center gap-2">
						<Check class="w-4 h-4 text-[#00923f] shrink-0" />
						<span>Largeur des colonnes ajustée automatiquement pour une lecture fluide.</span>
					</li>
					<li class="flex items-center gap-2">
						<Check class="w-4 h-4 text-[#00923f] shrink-0" />
						<span>Format de cellule texte forcé pour garantir la conservation des numéros de téléphone (aucun zéro initial tronqué).</span>
					</li>
				</ul>

				<div class="pt-3">
					<Button
						href="/api/export"
						variant="primary"
						size="lg"
						fullWidth
					>
						{#snippet children()}
							<Download class="w-5 h-5 mr-1" />
							<span>Télécharger le classeur Excel officiel (.xlsx)</span>
						{/snippet}
					</Button>
				</div>
			</div>
		</Card>
	</div>

	<!-- Tableau comparatif du modèle de données cible -->
	<Card class="border-slate-200">
		<div class="flex items-center gap-2 mb-4">
			<Database class="w-4 h-4 text-[#00923f]" />
			<h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
				Correspondance des Données Cibles (Spécification CDC)
			</h3>
		</div>

		<div class="overflow-x-auto text-xs">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
						<th class="py-2.5 px-3">Champ Modèle</th>
						<th class="py-2.5 px-3">Type SQL</th>
						<th class="py-2.5 px-3">En-tête brut historique</th>
						<th class="py-2.5 px-3">Format / Contraintes</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					<tr>
						<td class="py-2 px-3 font-mono font-bold text-[#00923f]">centre_pole</td>
						<td class="py-2 px-3">VARCHAR(50)</td>
						<td class="py-2 px-3 text-slate-400">Col 0: "Veuillez sélectionner votre centre..."</td>
						<td class="py-2 px-3">Défaut: "Bafoussam"</td>
					</tr>
					<tr>
						<td class="py-2 px-3 font-mono font-bold text-[#00923f]">nom_prenom</td>
						<td class="py-2 px-3">VARCHAR(120)</td>
						<td class="py-2 px-3 text-slate-400">Col 1: "Que voulez-vous faire ?"</td>
						<td class="py-2 px-3 font-semibold">Requis, suppression des espaces, majuscules</td>
					</tr>
					<tr>
						<td class="py-2 px-3 font-mono font-bold text-[#00923f]">telephone</td>
						<td class="py-2 px-3">VARCHAR(20)</td>
						<td class="py-2 px-3 text-slate-400">Col 2: "Veuillez renseigner le nom..."</td>
						<td class="py-2 px-3 font-semibold">Requis, standard 9 chiffres (6xx xxx xxx)</td>
					</tr>
					<tr>
						<td class="py-2 px-3 font-mono font-bold text-[#00923f]">statut_matrimonial</td>
						<td class="py-2 px-3">VARCHAR(30)</td>
						<td class="py-2 px-3 text-slate-400">Col 3: "Noms et prénoms :"</td>
						<td class="py-2 px-3">Célibataire / Marié(e) / Autre</td>
					</tr>
					<tr>
						<td class="py-2 px-3 font-mono font-bold text-[#00923f]">eglise</td>
						<td class="py-2 px-3">VARCHAR(100)</td>
						<td class="py-2 px-3 text-slate-400">Col 4: "Numéro de téléphone :"</td>
						<td class="py-2 px-3">Optionnel (EEC, Catholique, Évangélique...)</td>
					</tr>
					<tr>
						<td class="py-2 px-3 font-mono font-bold text-[#00923f]">profession</td>
						<td class="py-2 px-3">VARCHAR(100)</td>
						<td class="py-2 px-3 text-slate-400">Col 5: "Statut matrimonial :"</td>
						<td class="py-2 px-3">Optionnel (Enseignant, Commerçant, Élève...)</td>
					</tr>
					<tr>
						<td class="py-2 px-3 font-mono font-bold text-[#00923f]">statut_classe_it</td>
						<td class="py-2 px-3">VARCHAR(30)</td>
						<td class="py-2 px-3 text-slate-400">Col 6: "Eglise :"</td>
						<td class="py-2 px-3 font-semibold">"Non" | "Oui" | "Déjà dans une classe"</td>
					</tr>
				</tbody>
			</table>
		</div>
	</Card>
</div>
