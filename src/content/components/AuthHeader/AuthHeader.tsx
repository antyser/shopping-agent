import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  iconSrc: string;
}

function AuthHeader({ title, subtitle, iconSrc }: AuthHeaderProps) {
  return (
    <div className="self-stretch inline-flex flex-col justify-start items-center gap-7 mb-7">
      {/* Logo */}
      <div className="w-20 h-20 py-0.5 inline-flex justify-start items-center">
        <img
          className="w-20 h-20 relative opacity-90 rounded-[50px]"
          src={iconSrc}
          alt="App Logo"
        />
      </div>
      {/* Text Content */}
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="self-stretch text-center text-figma-text-primary text-3xl font-bold font-sans leading-10">
          {title}
        </div>
        <div className="self-stretch text-center text-figma-secondary-text-color text-base font-semibold font-sans leading-normal">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export default AuthHeader; 