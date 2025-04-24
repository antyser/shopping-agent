import React from 'react';

// Import section components (placeholders for now)
import HeaderSection from './HeaderSection/HeaderSection';
import SubNavigationSection from './SubNavigation/SubNavigationSection';
import AboutProductSection from './ProductInfo/AboutProductSection';
import ReviewsRatingsSection from './ProductInfo/ReviewsRatingsSection';
import SuitabilitySection from './ProductInfo/SuitabilitySection';
import SimilarProductsSection from './ProductInfo/SimilarProductsSection';
import MessageDisplay from './Chat/MessageDisplay';

// Re-use UserData and ChatMessage interfaces (consider moving to a shared types file later)
interface UserData {
	displayName: string | null;
	photoURL: string | null;
	email: string | null;
}
interface ChatMessage {
	id: string;
	sender: 'user' | 'ai';
	content: string;
	timestamp: Date;
}

// Define props for ScrollableContent
interface ScrollableContentProps {
	userData: UserData;
	messages: ChatMessage[];
}

function ScrollableContent({ userData, messages }: ScrollableContentProps) {
	return (
		<div className="flex-grow overflow-y-auto p-4 space-y-6 bg-background-color">
			{/* Pass userData down */}
			<HeaderSection userData={userData} />
			<SubNavigationSection />
			{/* TODO: Pass productContext down to these sections later */}
			<AboutProductSection />
			<ReviewsRatingsSection />
			<SuitabilitySection />
			<SimilarProductsSection />
			{/* Pass messages down */}
			<MessageDisplay messages={messages} />
		</div>
	);
}

export default ScrollableContent; 