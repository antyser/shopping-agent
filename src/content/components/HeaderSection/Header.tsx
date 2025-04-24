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
	const iconUrl = chrome.runtime.getURL('assets/logo.png');

	return (
		<div className="flex items-center">
			<div className="pl-[16px] flex items-center">
				<img
					src={iconUrl}
					alt="Logo"
					className="w-8 h-8 left-[16px] top-[16px] absolute"
				/>
			</div>
			<div className="ml-[12px]">
				<span className="text-primary-text-color text-base font-semibold leading-relaxed">
					Hi {userData.displayName ? `${userData.displayName}` : 'there'}, welcome!
				</span>
			</div>
		</div>
	);
}

export default Header; 