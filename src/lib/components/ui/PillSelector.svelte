<script lang="ts">
	interface OptionItem {
		value: string;
		label: string;
		desc?: string;
	}

	interface Props {
		name?: string;
		label?: string;
		value?: string;
		options: (string | OptionItem)[];
		required?: boolean;
		error?: string;
		helperText?: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		name,
		label,
		value = $bindable(''),
		options = [],
		required = false,
		error,
		helperText,
		class: className = '',
		onchange
	}: Props = $props();

	const normalizedOptions = $derived(
		options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt))
	);

	function select(val: string) {
		value = val;
		if (onchange) onchange(val);
	}
</script>

<div class="w-full flex flex-col gap-2 {className}">
	{#if label}
		<span class="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
			{label}
			{#if required}
				<span class="text-emerald-600 font-bold">*</span>
			{/if}
		</span>
	{/if}

	<!-- Hidden input for standard HTML form submission -->
	{#if name}
		<input type="hidden" {name} {value} />
	{/if}

	<div class="flex flex-wrap gap-2">
		{#each normalizedOptions as opt (opt.value)}
			{@const isSelected = value === opt.value}
			<button
				type="button"
				onclick={() => select(opt.value)}
				class="flex-1 min-w-[120px] min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 flex flex-col items-center justify-center text-center cursor-pointer border select-none active:scale-95 {isSelected
					? 'bg-[#00923f] text-white border-[#00923f] shadow-sm shadow-[#00923f]/30 ring-2 ring-[#00923f]/20'
					: 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}"
			>
				<span>{opt.label}</span>
				{#if opt.desc}
					<span class="text-[11px] {isSelected ? 'text-emerald-100' : 'text-slate-400'}">{opt.desc}</span>
				{/if}
			</button>
		{/each}
	</div>

	{#if error}
		<p class="text-xs text-red-600 font-medium">{error}</p>
	{:else if helperText}
		<p class="text-xs text-slate-500">{helperText}</p>
	{/if}
</div>
