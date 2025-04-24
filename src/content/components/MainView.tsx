import React, { useState } from 'react';
import ScrollableContent from './ScrollableContent'; // Placeholder import
import ChatInputSection from './ChatInputSection'; // Placeholder import

// Define the structure for user data passed as props
interface UserData {
	displayName: string | null;
	photoURL: string | null;
	email: string | null;
}

// Define the props for MainView
interface MainViewProps {
	userData: UserData;
}

// Define the structure for a chat message
// TODO: Refine this message structure later
interface ChatMessage {
	id: string;
	sender: 'user' | 'ai';
	content: string;
	timestamp: Date;
}

function MainView({ userData }: MainViewProps) {
	// State for managing chat messages
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	// Placeholder function for sending messages
	const handleSendMessage = (messageText: string) => {
		console.log("MainView: handleSendMessage called with:", messageText);
		// TODO: Implement actual message sending logic (to background script)
		// For now, let's just add the user message to the state
		const newMessage: ChatMessage = {
			id: `user-${Date.now()}`,
			sender: 'user',
			content: messageText,
			timestamp: new Date(),
		};
		setMessages(prevMessages => [...prevMessages, newMessage]);
		
		// TODO: Simulate AI response later
	};

	return (
		<div className="flex flex-col h-full bg-background-color">
			{/* Scrollable content area */}
			<ScrollableContent userData={userData} messages={messages} />

			{/* Fixed chat input area */}
			<ChatInputSection handleSendMessage={handleSendMessage} />
		</div>
	);
}

export default MainView; 