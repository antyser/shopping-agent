import React from 'react';
import { Input } from '../Shared/Input';
import { Icon } from '../Shared/Icon';

function SearchBar() {
	// TODO: Implement search state and logic
	return (
		<div className="relative flex-grow max-w-xs">
			<Icon
				name="Search"
				className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
				size={18}
			/>
			<Input
				type="search"
				placeholder="Search..."
				className="pl-10 h-9 text-sm bg-gray-100 border-gray-200 focus:bg-white focus:border-blue-500"
			/>
		</div>
	);
}

export default SearchBar; 