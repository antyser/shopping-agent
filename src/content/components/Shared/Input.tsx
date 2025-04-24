import React, { InputHTMLAttributes } from 'react';
// import { cn } from '@/lib/utils'; // Assuming you have clsx/tailwind-merge utility - Removed for now

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		// Basic styling, can be expanded. Combining base styles with provided className.
		const baseClasses = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';
		const combinedClasses = `${baseClasses} ${className || ''}`.trim();

		return (
			<input
				type={type}
				className={combinedClasses} // Use combined classes
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = 'Input';

export { Input }; 