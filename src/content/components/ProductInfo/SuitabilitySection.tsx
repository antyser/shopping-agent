import React from 'react';
import Tag from '../Shared/Tag';
import { Button } from '../Shared/Button';

// TODO: Accept productContext prop later
function SuitabilitySection() {
	return (
		<div className="p-4 border-b border-gray-200 space-y-3">
			<h2 className="text-lg font-semibold">Is it right for you?</h2>
			<div className="flex flex-wrap gap-2">
				<Tag>Keyword 1</Tag>
				<Tag>Target Audience</Tag>
				<Tag>Use Case</Tag>
			</div>
			<p className="text-sm text-gray-600">
				This section provides static text discussing who the product is best suited for, based on common use cases or target demographics. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
			</p>
			<Button variant="link" className="text-sm p-0 h-auto">
				See more
			</Button>
		</div>
	);
}

export default SuitabilitySection; 