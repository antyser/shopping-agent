import React, { useState, useEffect } from 'react'; // useEffect might still be needed for initial load or other effects
import { useStream } from '@langchain/langgraph-sdk/react';
// Remove Message type import as it's not directly used for state structure here
// import type { Message } from '@langchain/langgraph-sdk'; 
import Tag from '../Shared/Tag'; // Import Tag component
import { Button } from '../Shared/Button';
// Removed Input import
import ReactMarkdown from 'react-markdown'; // <-- Import ReactMarkdown

// Define state type based on the actual graph state schema
type AgentState = {
	product?: string | null;
	search_engine?: 'google' | 'openai' | null;
	output?: string | null;
};

// Define structure for agent options
interface AgentOption {
    id: string;
    name: string;
    search_engine: 'google' | 'openai' | null;
}

// Available agent options
const agentOptions: AgentOption[] = [
    { id: '9fff2f69-7c79-563f-b3e6-5a8e1dc1bc23', name: 'Google Direct Search', search_engine: 'google' },
    { id: 'f0eba683-ce57-47df-8723-820be95e4284', name: 'OpenAI Direct Search', search_engine: 'openai' },
    { id: '9f8183bb-5833-4494-a783-44fb2ed4721e', name: 'OpenAI Planned Agent', search_engine: 'openai' },
    { id: 'a8c74f0a-b971-4b7d-a33e-a6ba8719be7c', name: 'Google Planned Agent', search_engine: 'google' },
];

// Define props for the component
interface ProductInsightSectionProps {
	title: string | null; // Accept 'title' as a prop, can still be null if nothing extracted
}

function ProductInsightSection({ title: initialTitle }: ProductInsightSectionProps) { // Rename prop for clarity
	const [selectedAssistantId, setSelectedAssistantId] = useState<string>(agentOptions[0]?.id ?? '');
	const [submitPayload, setSubmitPayload] = useState<{ product: string } | null>(null);
    // State for the editable title
    const [editableTitle, setEditableTitle] = useState<string | null>(initialTitle);
    const [elapsedTime, setElapsedTime] = useState<number>(0); // State for the timer

    // Effect to update editableTitle when the initialTitle prop changes
    useEffect(() => {
        setEditableTitle(initialTitle);
    }, [initialTitle]);

	// --- LangGraph Integration --- (assistantId and threadId are passed here)
	const { values, submit, isLoading, error } = useStream<AgentState>({
		apiUrl: 'https://product-summary-511890e2c01d54c59f5ce7ba59aaec23.us.langgraph.app',
		apiKey: process.env.REACT_APP_LANGSMITH_API_KEY,
		assistantId: selectedAssistantId,
		threadId: null, // Always pass null to start a new thread for each stream interaction
	});

    // Effect to manage the timer when isLoading changes
    // MOVED HERE - AFTER isLoading IS DEFINED
    useEffect(() => {
        let timerInterval: NodeJS.Timeout | undefined = undefined;

        if (isLoading) {
            setElapsedTime(0); // Reset timer when loading starts
            timerInterval = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000); // Update every second
        } else {
            // Clear interval if it exists and loading is false
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        }

        // Cleanup function to clear interval when component unmounts or isLoading changes
        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, [isLoading]);

	// Effect to handle submission when submitPayload is set
	useEffect(() => {
		if (submitPayload && !isLoading) {
            // Find the selected agent option to get its search_engine value
            const currentAgent = agentOptions.find(agent => agent.id === selectedAssistantId);
            const searchEngineForSubmit = currentAgent ? currentAgent.search_engine : null;

			console.log(`Submitting product '${submitPayload.product}' (new thread) with assistant '${selectedAssistantId}', search_engine: '${searchEngineForSubmit}'`);
			submit({ product: submitPayload.product, search_engine: searchEngineForSubmit });
			setSubmitPayload(null); 
		}
	}, [submitPayload, isLoading, submit, selectedAssistantId]);

	// Handler for submitting the detected product name
	const handleGetInsights = () => {
		if (!editableTitle) return; // Use editableTitle here
		console.log(`Requesting new thread for product: ${editableTitle}`);
		setSubmitPayload({ product: editableTitle }); // Use editableTitle here
	};

	const handleAgentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newAssistantId = event.target.value;
		console.log(`Agent changed to: ${newAssistantId}`);
		setSelectedAssistantId(newAssistantId);
		// No need to call setCurrentThreadId(null)
		setSubmitPayload(null); 
	};

	// --- Rendering Logic --- 
	return (
		<div className="p-4 border-b border-gray-200 space-y-4">
			<h2 className="text-lg font-semibold">Product Insights</h2>

			{/* Agent Selection Dropdown */} 
			<div className="mb-4">
				<label htmlFor="agent-select" className="block text-sm font-medium text-gray-700 mb-1">
					Search Mode:
				</label>
				<select
					id="agent-select"
					name="agent"
					value={selectedAssistantId}
					onChange={handleAgentChange}
					disabled={isLoading} // Disable while loading an insight
					className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
				>
					{agentOptions.map((option) => (
						<option key={option.id} value={option.id}>
							{option.name}
						</option>
					))}
				</select>
			</div>

			{/* Editable Product Title and Button */} 
			<div className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded">
				{initialTitle !== null ? ( // Check initialTitle to decide if we should show an input or placeholder
                    <input
                        type="text"
                        value={editableTitle ?? ''} // Handle null for controlled input
                        onChange={(e) => setEditableTitle(e.target.value)}
                        placeholder="Enter product title..."
                        className="text-sm font-medium text-gray-700 truncate bg-transparent focus:outline-none focus:ring-0 border-none p-0 flex-grow"
                        title={editableTitle ?? undefined}
                    />
				) : (
					<p className="text-sm text-gray-500 italic flex-grow">No product title detected on this page.</p>
				)}
				<Button 
					onClick={handleGetInsights} 
					disabled={isLoading || !editableTitle} // Use editableTitle here
					className="flex-shrink-0"
				>
					{isLoading ? `Loading... (${elapsedTime}s)` : 'Get Insights'}
				</Button>
			</div>

			{error instanceof Error && (
				<p className="text-sm text-red-600">Error loading insights: {error.message}</p>
			)}

			{values?.output && (
				<div className="prose prose-sm max-w-none border-t border-gray-200 pt-4 mt-4">
					<h3 className="font-medium mb-2">Results:</h3>
					<ReactMarkdown>{values.output}</ReactMarkdown>
				</div>
			)}

			{/* Initial/No Results Placeholder - only show if not loading and no error and no results yet */}
			{/* Also check if a product name was detected before showing this */}
			{!isLoading && !error && !values?.output && initialTitle && (
				<p className="text-sm text-gray-500 pt-4 border-t border-gray-200 mt-4">
					Click "Get Insights" above to analyze the detected product.
				</p>
			)}
		</div>
	);
}

export default ProductInsightSection; 