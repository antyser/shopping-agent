import React from 'react';
import { cn } from '../../../lib/utils'; // Assuming utils is three levels up
import Avatar from '../Shared/Avatar'; // Use the shared Avatar

// Re-use ChatMessage interface (consider moving to shared types)
interface ChatMessage {
	id: string;
	sender: 'user' | 'ai';
	content: string;
	timestamp: Date;
}

interface MessageProps {
	message: ChatMessage;
	// TODO: Add user photoURL later if needed for AI messages or user messages
}

function Message({ message }: MessageProps) {
	const isUser = message.sender === 'user';

	// Basic styling - can be significantly enhanced
	return (
		<div className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}>
			<div className={cn("flex items-end gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
				{/* Avatar: Show for AI, could show for user too if desired */}
				{!isUser && (
					<Avatar src={null} alt="AI Assistant" className="w-6 h-6" /> // Smaller avatar for chat
				)}
				{/* Message Bubble */}
				<div
					className={cn(
						"max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow",
						isUser
							? "bg-blue-500 text-white rounded-br-none"
							: "bg-gray-100 text-gray-800 rounded-bl-none"
					)}
				>
					<p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {/* Optional: Timestamp */}
                    {/* <span className="text-xs text-gray-400 block text-right mt-1">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> */}
				</div>
			</div>
		</div>
	);
}

export default Message; 