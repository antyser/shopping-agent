import React, { useState } from 'react';
import { Button } from './Shared/Button'; // Assuming Button is in Shared
import { Send } from 'lucide-react'; // Example icon

// Define props
interface ChatInputSectionProps {
	handleSendMessage: (messageText: string) => void;
}

function ChatInputSection({ handleSendMessage }: ChatInputSectionProps) {
	const [inputValue, setInputValue] = useState('');

	const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
		e?.preventDefault(); // Prevent form submission if used in a form
		if (inputValue.trim()) {
			handleSendMessage(inputValue);
			setInputValue(''); // Clear input after sending
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Send message on Enter key press, unless Shift is held
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent newline in textarea
            handleSubmit();
        }
    };

	// Placeholder suggested questions
	const suggestedQuestions = [
		"What are the main pros and cons?",
		"Is this good value for money?",
		"Summarize the reviews for me."
	];

	return (
		<div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-upward">
			{/* Suggested Questions */}
			<div className="flex flex-wrap gap-2 mb-3">
				{suggestedQuestions.map((q, index) => (
					<Button 
						key={index}
						variant="outline"
						size="sm"
						className="text-xs h-auto py-1 px-2 rounded-full text-gray-600 border-gray-300"
						onClick={() => handleSendMessage(q)}
					>
						{q}
					</Button>
				))}
			</div>

			{/* Input Area */}
			<div className="flex items-end gap-2">
				{/* TODO: Add other action icons later (upload, mic) */}
				<textarea
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Ask anything..."
					className="flex-grow resize-none border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[40px] max-h-[120px]"
					rows={1} // Start with one row, will expand
					style={{ height: 'auto' }} // Let content determine height initially
				/>
				<Button
					size="icon"
					className="h-10 w-10 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white"
					onClick={() => handleSubmit()}
					disabled={!inputValue.trim()} // Disable if input is empty
					aria-label="Send message"
				>
					<Send size={20} />
				</Button>
			</div>
		</div>
	);
}

export default ChatInputSection; 