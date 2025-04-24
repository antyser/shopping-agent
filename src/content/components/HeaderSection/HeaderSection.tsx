import React from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import UserActions from './UserActions';

// Reuse UserData interface
interface UserData {
	displayName: string | null;
	photoURL: string | null;
	email: string | null;
}

// Define props for HeaderSection
interface HeaderSectionProps {
	userData: UserData;
}

function HeaderSection({ userData }: HeaderSectionProps) {
	return (
		<div className="flex items-center justify-between h-16 p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
			{/* Pass userData down to Header */}
			<Header userData={userData} />
			<div className="flex items-center gap-4">
				<SearchBar />
				<UserActions />
			</div>
		</div>
	);
}

export default HeaderSection; 