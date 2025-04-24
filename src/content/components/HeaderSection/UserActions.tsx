import React from 'react'
import { Button } from '../Shared/Button'
import { Icon } from '../Shared/Icon'
import { useAuth } from '../../state/AuthProvider'

// Placeholder for Icon/Avatar components - replace with actual imports
const BellIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const Avatar = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={`relative flex items-center justify-center overflow-hidden rounded-full ${className}`}>{children}</div>;
const AvatarImage = ({ src, alt, className }: { src?: string, alt: string, className?: string }) => <img src={src} alt={alt} className={`aspect-square h-full w-full ${className}`} />;
const AvatarFallback = ({ className, children }: { className?: string, children: React.ReactNode }) => <span className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>{children}</span>;
// --- End Placeholder Components ---

interface UserData {
	displayName: string | null;
	photoURL: string | null;
	email?: string | null; // Optional
}

interface UserActionsProps {
	userData: UserData;
}

function UserActions({ userData }: UserActionsProps) {
	const { logout } = useAuth()
	// TODO: Implement profile dropdown/modal logic

	const getInitials = (name: string | null) => {
		return name ? name.charAt(0).toUpperCase() : '?';
	}

	return (
		<div className="flex items-center gap-3.5">
			{/* Notification Bell */}
			<button className="relative rounded-full p-1 text-primary-text-color hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
				<span className="sr-only">View notifications</span>
				{/* Bell Icon: w-6 h-6 */}
				<BellIcon className="h-6 w-6" aria-hidden="true" />
				{/* Notification Dot: bg-Badge-pink -> bg-badge-pink */}
				{/* Adjust positioning based on icon size/shape */}
				<div className="absolute right-0 top-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-badge-pink p-0.5">
					{/* Inner dot if needed, or just use the outer div */}
				</div>
			</button>

			{/* User Avatar */}
			{/* Use Avatar component: w-6 h-6, rounded-3xl -> rounded-full */}
			<Avatar className="h-6 w-6">
				{/* Use photoURL if available */}
				<AvatarImage src={userData.photoURL || undefined} alt={userData.displayName || 'User'} />
				{/* Fallback to initials */}
				<AvatarFallback className="text-xs bg-gray-200 text-gray-600">
					{getInitials(userData.displayName)}
				</AvatarFallback>
			</Avatar>
		</div>
	)
}

export default UserActions 