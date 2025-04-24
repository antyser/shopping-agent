import React from 'react';
import Avatar from '../Shared/Avatar'; // Corrected path

// Reuse UserData interface
interface UserData {
	displayName: string | null;
	photoURL: string | null;
	email: string | null; // Keep email even if not displayed here
}

interface HeaderProps {
	userData: UserData;
}

function Header({ userData }: HeaderProps) {
	return (
		<div className="flex items-center gap-2">
			<Avatar src={userData.photoURL} alt={userData.displayName || 'User'} />
			<div>
				<p className="text-sm font-medium text-gray-800">
					{userData.displayName || 'Welcome!'}
				</p>
				{/* Optional: Add subtitle or email if needed */}
				{/* <p className="text-xs text-gray-500">Have a nice day</p> */}
			</div>
		</div>
	);
}

export default Header; 