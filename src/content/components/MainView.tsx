import React, { useState } from 'react';
import ScrollableContent from './ScrollableContent';
import ChatInputSection from './ChatInputSection';
import HeaderSection from './HeaderSection/HeaderSection';

// Define the structure for user data passed as props
interface UserData {
	displayName: string | null;
	photoURL: string | null;
	email: string | null;
}

// Define the props for MainView
interface MainViewProps {
	userData: UserData;
	title: string | null;
	url: string | null;
}

// Define the structure for a chat message
// TODO: Refine this message structure later
interface ChatMessage {
	id: string;
	sender: 'user' | 'ai';
	content: string;
	timestamp: Date;
}

function MainView({ userData, title, url }: MainViewProps) {
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
			{/* Render HeaderSection here */}
			<HeaderSection userData={userData} />

			{/* Scrollable content area - make it grow */}
			<div className="flex-1 overflow-y-auto">
				<ScrollableContent userData={userData} messages={messages} title={title} url={url} />
			</div>

			{/* Fixed chat input area - prevent it from shrinking */}
{/* 			<div className="flex-shrink-0">
				<ChatInputSection handleSendMessage={handleSendMessage} />
			</div> */}
		</div>
	);
}

export default MainView; 