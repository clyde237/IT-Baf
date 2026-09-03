<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		type?: 'button' | 'submit' | 'reset';
		fullWidth?: boolean;
		disabled?: boolean;
		loading?: boolean;
		href?: string;
		onclick?: (e: MouseEvent) => void;
		children?: Snippet;
		class?: string;
		[key: string]: any;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		fullWidth = false,
		disabled = false,
		loading = false,
		href,
		onclick,
		children,
		class: className = '',
		...rest
	}: Props = $props();

	const baseStyles =
		'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

	const sizeStyles = {
		sm: 'px-3 py-1.5 text-xs min-h-[36px] gap-1.5',
		md: 'px-4 py-2.5 text-sm min-h-[44px] gap-2 shadow-xs',
		lg: 'px-6 py-3.5 text-base min-h-[50px] gap-2.5 font-semibold shadow-sm'
	};

	const variantStyles = {
		primary:
			'bg-[#00923f] text-white hover:bg-[#006b2e] focus-visible:ring-[#00923f] shadow-[#00923f]/20',
		secondary:
			'bg-[#e8f5ee] text-[#006b2e] hover:bg-[#d5edd1] focus-visible:ring-[#00923f]',
		outline:
			'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400',
		ghost:
			'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
		danger:
			'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-red-600/20'
	};
</script>

{#if href}
	<a
		{href}
		class="{baseStyles} {sizeStyles[size]} {variantStyles[variant]} {fullWidth ? 'w-full' : ''} {className}"
		{...rest}
	>
		{#if loading}
			<span class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
		{/if}
		{@render children?.()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		{onclick}
		class="{baseStyles} {sizeStyles[size]} {variantStyles[variant]} {fullWidth ? 'w-full' : ''} {className}"
		{...rest}
	>
		{#if loading}
			<span class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
		{/if}
		{@render children?.()}
	</button>
{/if}
