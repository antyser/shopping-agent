import React from 'react';
import { Button } from '../Shared/Button';
import { Icon } from '../Shared/Icon'; // Import Icon

// Basic placeholder card component (can be moved to Shared/Card.tsx later)
function ProductCardPlaceholder() {
	return (
		<div className="border rounded-lg p-3 w-32 flex-shrink-0">
			<div className="bg-gray-200 h-16 w-full rounded mb-2"></div> {/* Image placeholder */}
			<p className="text-xs font-medium truncate">Similar Product</p>
			<p className="text-xs text-gray-500">$XX.XX</p>
		</div>
	);
}

// TODO: Accept productContext prop later
function SimilarProductsSection() {
	return (
		<div className="p-4 border-b border-gray-200 space-y-3">
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold">Similar products</h2>
				<Button variant="ghost" size="sm" className="text-gray-600">
					{/* TODO: Add scroll functionality */}
                    {/* Using MoreHorizontal for now as a placeholder arrow */}
					<Icon name="MoreHorizontal" size={18} /> 
				</Button>
			</div>
			<div className="flex space-x-3 overflow-x-auto pb-2">
				{/* Render placeholder cards */}
				<ProductCardPlaceholder />
				<ProductCardPlaceholder />
				<ProductCardPlaceholder />
				<ProductCardPlaceholder />
				<ProductCardPlaceholder />
			</div>
		</div>
	);
}

export default SimilarProductsSection; 