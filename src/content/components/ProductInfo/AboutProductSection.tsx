import React from 'react';
import Tag from '../Shared/Tag'; // Import Tag component
import { Button } from '../Shared/Button';

// TODO: Accept productContext prop later
function AboutProductSection() {
	return (
		<div className="p-4 border-b border-gray-200 space-y-3">
			<h2 className="text-lg font-semibold">About this product</h2>
			<div className="flex flex-wrap gap-2">
				<Tag>Feature Tag 1</Tag>
				<Tag>Another Tag</Tag>
				<Tag>Category</Tag>
			</div>
			<div>
				<h3 className="font-medium mb-1">Overview</h3>
				<p className="text-sm text-gray-600">
					This is a static overview of the product. It describes the main features and benefits.
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				</p>
			</div>
			<div>
				<h3 className="font-medium mb-1">Highlights</h3>
				<ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
					<li>Static highlight point one.</li>
					<li>Another interesting highlight.</li>
					<li>Third highlight about a feature.</li>
				</ul>
			</div>
            {/* Example Deal Box */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm font-medium text-green-800">Deal: 15% off today!</p>
            </div>
			<Button variant="link" className="text-sm p-0 h-auto">
				See more details
			</Button>
		</div>
	);
}

export default AboutProductSection; 