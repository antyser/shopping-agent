import React, { useState } from 'react';
import { useStream } from '@langchain/langgraph-sdk/react';
// Remove Message type import as it's not directly used for state structure here
// import type { Message } from '@langchain/langgraph-sdk'; 
import Tag from '../Shared/Tag'; // Import Tag component
import { Button } from '../Shared/Button';
import { Input } from '../Shared/Input'; // Assuming you have an Input component
import ReactMarkdown from 'react-markdown'; // <-- Import ReactMarkdown

// Define state type based on the actual graph state schema
type AgentState = {
	product?: string | null;
	search_engine?: 'google' | 'openai' | null;
	search_results?: string | null;
};

// TODO: Accept productContext prop later to pass the actual product name
function ProductInsightSection() {
	// State for the product name input
	const [productName, setProductName] = useState('');

	// --- LangGraph Integration --- 
	// Access the full state via `values` 
	const { values, submit, isLoading, error } = useStream<AgentState>({ 
		apiUrl: 'https://product-summary-511890e2c01d54c59f5ce7ba59aaec23.us.langgraph.app',
		apiKey: process.env.REACT_APP_LANGSMITH_API_KEY,
		assistantId: '9fff2f69-7c79-563f-b3e6-5a8e1dc1bc23',
		// Remove messagesKey - we are not streaming into a 'messages' array
		// messagesKey: 'messages', 
	});

	// Handler for submitting the product name
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // Prevent page reload
		if (!productName.trim()) return; // Don't submit if input is empty
		submit({ product: productName });
	};

	// --- Rendering Logic --- 
	return (
		<div className="p-4 border-b border-gray-200 space-y-4">
			<h2 className="text-lg font-semibold">Product Insights</h2>

			{/* Input Form */}
			<form onSubmit={handleSubmit} className="flex items-center gap-2">
				<Input
					type="text"
					value={productName}
					onChange={(e) => setProductName(e.target.value)}
					placeholder="Enter product name..."
					className="flex-grow"
					disabled={isLoading} // Disable input while loading
				/>
				<Button type="submit" disabled={isLoading || !productName.trim()}>
					{isLoading ? 'Loading...' : 'Get Insights'}
				</Button>
			</form>

			{/* Loading State */}
			{/* Note: isLoading is now primarily indicated by the button state */}
			{/* You could add a more prominent global loading indicator if desired */}

			{/* Error Display */}
			{error instanceof Error && (
				<p className="text-sm text-red-600">Error loading insights: {error.message}</p>
			)}

			{/* Display search_results from the streamed state using ReactMarkdown */}
			{values?.search_results && (
				<div className="prose prose-sm max-w-none border-t border-gray-200 pt-4 mt-4">
					<h3 className="font-medium mb-2">Results:</h3>
					<ReactMarkdown>{values.search_results}</ReactMarkdown>
				</div>
			)}

			{/* Initial/No Results Placeholder - only show if not loading and no error and no results yet */}
			{!isLoading && !error && !values?.search_results && (
				<p className="text-sm text-gray-500 pt-4 border-t border-gray-200 mt-4">
					Enter a product name above to get insights.
				</p>
			)}

			{/* 
			  Removed static content.
			  Consider adding back relevant UI elements based on streamed data 
			  (e.g., display values.product or values.search_engine if needed).
			*/}
		</div>
	);
}

export default ProductInsightSection; 