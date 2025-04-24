import React from 'react';
import { Input } from '../Shared/Input';

// Placeholder for Icon
const SearchIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
// --- End Placeholder ---

function SearchBar() {
	// TODO: Implement search state and logic
	return (
		<div className="relative flex items-center">
			<SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-text-color" />
			<Input
				type="search"
				placeholder="Search anything..."
				className="h-9 w-[436px] rounded-lg bg-input-bg py-2 pl-9 pr-3 text-base font-normal leading-tight text-secondary-text-color placeholder:text-secondary-text-color focus:outline-none focus:ring-1 focus:ring-primary-500 !border-none !shadow-none"
			/>
		</div>
	);
}

export default SearchBar; 