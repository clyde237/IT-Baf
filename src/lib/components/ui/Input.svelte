<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id?: string;
		name?: string;
		type?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		required?: boolean;
		error?: string;
		helperText?: string;
		inputmode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search' | 'decimal';
		autocapitalize?: 'none' | 'sentences' | 'words' | 'characters';
		autocomplete?: any;
		disabled?: boolean;
		icon?: Snippet;
		class?: string;
		oninput?: (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => void;
		[key: string]: any;
	}

	let {
		id,
		name,
		type = 'text',
		label,
		placeholder,
		value = $bindable(''),
		required = false,
		error,
		helperText,
		inputmode,
		autocapitalize,
		autocomplete,
		disabled = false,
		icon,
		class: className = '',
		oninput,
		...rest
	}: Props = $props();
</script>

<div class="w-full flex flex-col gap-1.5 {className}">
	{#if label}
		<label for={id} class="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
			{label}
			{#if required}
				<span class="text-emerald-600 font-bold">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative flex items-center">
		{#if icon}
			<div class="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
				{@render icon()}
			</div>
		{/if}

		<input
			{id}
			{name}
			{type}
			{placeholder}
			{required}
			{disabled}
			{inputmode}
			{autocapitalize}
			{autocomplete}
			bind:value
			{oninput}
			class="w-full bg-white text-slate-900 border {error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#00923f] focus:ring-[#00923f]/25'} rounded-xl {icon ? 'pl-11' : 'pl-3.5'} pr-3.5 py-3 text-sm min-h-[46px] outline-none transition-all duration-150 focus:ring-3 disabled:bg-slate-50 disabled:cursor-not-allowed placeholder:text-slate-400"
			{...rest}
		/>
	</div>

	{#if error}
		<p class="text-xs text-red-600 font-medium">{error}</p>
	{:else if helperText}
		<p class="text-xs text-slate-500">{helperText}</p>
	{/if}
</div>
