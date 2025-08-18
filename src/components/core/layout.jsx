import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans p-4 sm:p-8 overflow-x-hidden">
      <div className="fixed top-0 left-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_20%_20%,_hsl(var(--primary))_0,_transparent_30%),_radial-gradient(circle_at_80%_70%,_hsl(var(--destructive))_0,_transparent_30%)] -z-10 -translate-x-1/2 -translate-y-1/2 blur-3xl saturate-150 opacity-20 animate-background-pan" />
      <div className="relative z-10 bg-card/80 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl shadow-black/20 p-4 sm:p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;