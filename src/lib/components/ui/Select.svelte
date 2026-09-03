<script lang="ts">
	interface OptionItem {
		value: string;
		label: string;
	}

	interface Props {
		id?: string;
		name?: string;
		label?: string;
		value?: string;
		options?: (string | OptionItem)[];
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		helperText?: string;
		class?: string;
		[key: string]: any;
	}

	let {
		id,
		name,
		label,
		value = $bindable(''),
		options = [],
		placeholder,
		required = false,
		disabled = false,
		error,
		helperText,
		class: className = '',
		...rest
	}: Props = $props();

	const normalizedOptions = $derived(
		options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt))
	);
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

	<div class="relative">
		<select
			{id}
			{name}
			{required}
			{disabled}
			bind:value
			class="w-full bg-white text-slate-900 border {error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#00923f] focus:ring-[#00923f]/25'} rounded-xl px-3.5 py-3 text-sm min-h-[46px] outline-none transition-all duration-150 focus:ring-3 disabled:bg-slate-50 disabled:cursor-not-allowed appearance-none cursor-pointer pr-10"
			{...rest}
		>
			{#if placeholder}
				<option value="" disabled selected={!value}>{placeholder}</option>
			{/if}
			{#each normalizedOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>

		<div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</div>
	</div>

	{#if error}
		<p class="text-xs text-red-600 font-medium">{error}</p>
	{:else if helperText}
		<p class="text-xs text-slate-500">{helperText}</p>
	{/if}
</div>
