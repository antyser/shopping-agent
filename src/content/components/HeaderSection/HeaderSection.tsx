import React from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import UserActions from './UserActions';
// import { Separator } from '@/components/ui/separator'; // Replaced with div

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
		<div className="relative flex w-full h-16 items-center justify-between bg-grays-white">
			<div className="flex items-center gap-2">

				<Header userData={userData} />
			</div>

			<div className="flex items-center gap-3.5">
				{/* <SearchBar /> */}
				{/* Vertical Divider */}
				<div className="h-7 w-px bg-divider" /> 
				{/* <Separator orientation="vertical" className="h-7 bg-divider" /> */}
				<UserActions userData={userData} />
			</div>
			<div className="absolute bottom-0 left-0 w-full h-px bg-divider" />
		</div>
	);
}

export default HeaderSection; 