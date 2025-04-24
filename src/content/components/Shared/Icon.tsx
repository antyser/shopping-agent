import React from 'react';
import {
	Search,
	Bell,
	User,
	MoreHorizontal,
	// Add other commonly used icons here as needed
	LucideProps
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// Explicitly map icon names to components
const iconMap = {
	Search,
	Bell,
	User,
	MoreHorizontal,
	// Add mappings here
};

export type IconName = keyof typeof iconMap;

interface IconProps extends LucideProps {
	name: IconName;
	className?: string;
	size?: number | string;
}

function Icon({ name, className, size = 16, ...props }: IconProps) {
	const LucideIconComponent = iconMap[name];

	if (!LucideIconComponent) {
		console.warn(`Icon "${name}" not found in explicit map`);
		return null; // Or return a default fallback icon (e.g., <QuestionMark size={size} />)
	}

	return (
		<LucideIconComponent
			className={cn("inline-block", className)}
			size={size}
			{...props}
		/>
	);
}

export { Icon }; // Export only the component 