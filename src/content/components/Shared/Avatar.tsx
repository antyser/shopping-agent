import React from 'react';
import { cn } from '../../../lib/utils'; // Assuming utils is three levels up
import { User } from 'lucide-react'; // Default icon

interface AvatarProps {
	src?: string | null;
	alt?: string;
	className?: string;
}

function Avatar({ src, alt = 'User Avatar', className }: AvatarProps) {
	return (
		<div
			className={cn(
				'relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200 items-center justify-center',
				className
			)}
		>
			{src ? (
				<img src={src} alt={alt} className="aspect-square h-full w-full" />
			) : (
				<User className="h-5 w-5 text-gray-500" /> // Default placeholder icon
			)}
		</div>
	);
}

export default Avatar; 