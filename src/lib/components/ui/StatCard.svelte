<script lang="ts">
	import type { Snippet, Component } from 'svelte';

	interface Props {
		title: string;
		value: number | string;
		subtitle?: string;
		icon?: Component;
		variant?: 'it' | 'blue' | 'amber' | 'slate';
		class?: string;
	}

	let {
		title,
		value,
		subtitle,
		icon: IconComponent,
		variant = 'it',
		class: className = ''
	}: Props = $props();

	const variantStyles = {
		it: {
			bg: 'bg-emerald-50/70 text-[#00923f]',
			border: 'border-emerald-100',
			val: 'text-[#006b2e]'
		},
		blue: {
			bg: 'bg-blue-50/70 text-blue-600',
			border: 'border-blue-100',
			val: 'text-blue-900'
		},
		amber: {
			bg: 'bg-amber-50/70 text-amber-600',
			border: 'border-amber-100',
			val: 'text-amber-900'
		},
		slate: {
			bg: 'bg-slate-100 text-slate-700',
			border: 'border-slate-200',
			val: 'text-slate-900'
		}
	};
</script>

<div class="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex items-start justify-between gap-4 {className}">
	<div class="flex flex-col gap-1">
		<span class="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
		<span class="text-3xl font-extrabold {variantStyles[variant].val} tracking-tight">
			{value}
		</span>
		{#if subtitle}
			<span class="text-xs text-slate-500 mt-1">{subtitle}</span>
		{/if}
	</div>

	{#if IconComponent}
		<div class="w-12 h-12 rounded-xl flex items-center justify-center {variantStyles[variant].bg} shrink-0">
			<IconComponent class="w-6 h-6" />
		</div>
	{/if}
</div>
