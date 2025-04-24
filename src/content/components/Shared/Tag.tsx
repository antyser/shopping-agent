import React from 'react';
import { cn } from '../../../lib/utils';

interface TagProps {
	children: React.ReactNode;
	className?: string;
	// Add variant props later if needed (e.g., color)
}

function Tag({ children, className }: TagProps) {
	return (
		<span
			className={cn(
				'inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
				className
			)}
		>
			{children}
		</span>
	);
}

export default Tag; 