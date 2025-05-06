import React, { useRef, useEffect } from 'react';

// Import section components (placeholders for now)
import SubNavigationSection from './SubNavigation/SubNavigationSection';
import ProductInsightSection from './ProductInfo/ProductInsightSection';
import ReviewsRatingsSection from './ProductInfo/ReviewsRatingsSection';
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
	userData: UserData | null;
	messages: ChatMessage[];
	title: string | null;
	url: string | null;
}

function ScrollableContent({ userData, messages, title, url }: ScrollableContentProps) {
	// Ref for the scrollable container
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Effect to scroll to top on mount
	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = 0;
		}
	}, []); // Empty dependency array ensures this runs only once on mount

	return (
		// Attach the ref to the scrollable div - No padding on main container
		<div ref={scrollContainerRef} className="flex-grow overflow-y-auto bg-background-color">
			{/* Content sections with consistent padding */}
			<div className="px-4">
				<SubNavigationSection />
				{/* Pass title prop to ProductInsightSection */}
				<ProductInsightSection title={title} />
				{/* Pass messages down */}
				<MessageDisplay messages={messages} />
			</div>
		</div>
	);
}

export default ScrollableContent; 