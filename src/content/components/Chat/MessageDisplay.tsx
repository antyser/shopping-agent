import React, { useEffect, useRef } from 'react';
import Message from './Message';

// Re-use ChatMessage interface (consider moving to shared types)
interface ChatMessage {
	id: string;
	sender: 'user' | 'ai';
	content: string;
	timestamp: Date;
}

interface MessageDisplayProps {
	messages: ChatMessage[];
}

function MessageDisplay({ messages }: MessageDisplayProps) {
	const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

	// Scroll to bottom when messages change
	useEffect(() => {
		endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="p-4 space-y-4">
			{messages.length === 0 ? (
				<p className="text-center text-gray-500 text-sm italic">No messages yet. Ask something below!</p>
			) : (
				messages.map((msg) => (
					<Message key={msg.id} message={msg} />
				))
			)}
			{/* Element to scroll to */}
			<div ref={endOfMessagesRef} />
		</div>
	);
}

export default MessageDisplay; 