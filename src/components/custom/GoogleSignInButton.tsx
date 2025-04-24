import React from 'react';
import { Button, ButtonProps } from '../ui/button'; // Adjust path if needed
import { cn } from '../../lib/utils'; // Adjust path if needed

interface GoogleSignInButtonProps extends Omit<ButtonProps, 'variant' | 'size' | 'children'> {
  // You can add specific props for this button if needed later
}

// Load the Google icon URL securely using chrome.runtime.getURL
// IMPORTANT: Ensure 'assets/google.png' is listed under 'web_accessible_resources' 
// in your manifest.json
let googleIconUrl = '';
try {
  googleIconUrl = chrome.runtime.getURL('assets/google.png');
} catch (e) {
  console.warn("Could not get Google icon URL. Ensure 'assets/google.png' is in web_accessible_resources.");
  // Provide a fallback or handle the error appropriately
}

const GoogleSignInButton = React.forwardRef<HTMLButtonElement, GoogleSignInButtonProps>(
  ({ className, ...props }, ref) => {
    // --- Style mapping from Figma/HTML ---
    // Type: Outline -> variant="outline"
    // Size: h-9 -> size="sm" (Shadcn 'sm' is h-9)
    // Rounded: rounded-lg -> Add 'rounded-lg' className to override default 'rounded-md' from size='sm'
    // Background: bg-Background-bg-secondary -> Default 'outline' is bg-white, seems correct.
    // Outline Color: outline-Border-border-primary -> Default 'outline' is border-slate-200. Assuming this matches. Adjust if needed.
    // Text Color: text-Text-secondary -> Map to a Tailwind color like 'text-slate-700'. Adjust as needed.
    // Font: font-['Poppins'] -> Use a standard font like 'font-medium'. Add 'font-poppins' if you've configured it in Tailwind.
    // Width: w-96 -> Let's use w-full for better flexibility within containers.
    // -------------------------------------

    return (
      <Button
        variant="outline"
        size="sm" // h-9, includes px-3
        className={cn(
          "w-full", // Use full width for container flexibility
          "justify-center", // Center content
          "gap-2", // Space between icon and text (adjust from gap-1 if needed)
          "rounded-lg", // Override default rounding for 'sm' size
          "text-slate-700", // Mapped text color - ADJUST if needed
          "hover:text-slate-900", // Default hover from 'outline' variant
          "font-poppins font-medium", // Use Poppins font, medium weight
          "border-Border-border-primary", // Explicitly set the border color
          // Add specific border color override if 'border-Border-border-primary' != 'border-slate-200'
          // e.g., "border-my-custom-border-color"
          className // Allow external class overrides
        )}
        ref={ref}
        {...props}
      >
        {googleIconUrl && ( // Only render img if URL is valid
           <img
            src={googleIconUrl}
            alt="" // Decorative image, alt text provided by button text
            className="w-5 h-5" // Size from your HTML example
           />
        )}
        <span>Continue with Google</span> {/* Use descriptive text */}
      </Button>
    );
  }
);

GoogleSignInButton.displayName = 'GoogleSignInButton';

export { GoogleSignInButton }; 