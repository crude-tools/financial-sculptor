import React from 'react';
import { Lock, Gem } from 'lucide-react';

const StudioPreview = () => {
  const handleUpgrade = () => {
      alert("Studio Pro is coming soon! Get ready for advanced financial mastery.");
  }
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <Gem size={64} className="text-primary" />
      </div>
      <h2 className="font-heading text-3xl font-bold mt-4">Unlock Your Financial Studio</h2>
      <p className="max-w-xl mx-auto mt-2 text-muted-foreground">Graduate from basic goals to strategic wealth architecture. The Studio is a premium suite of tools for ambitious builders.</p>
      
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 mt-12 text-left">
          <div className="bg-secondary/30 p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Advanced 6-Category Allocation</h3>
              <p className="text-sm text-muted-foreground">Move beyond simple splits to a holistic framework covering everything from essentials to legacy.</p>
          </div>
          <div className="bg-secondary/30 p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Load Path Analysis</h3>
              <p className="text-sm text-muted-foreground">Visualize how money flows through your financial life to identify strengths and weaknesses.</p>
          </div>
      </div>

      <div className="mt-12">
        <button onClick={handleUpgrade} className="flex items-center gap-2 mx-auto bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-md hover:bg-primary/90 transition-colors duration-200">
          <Lock size={16}/> Upgrade to Unlock Studio
        </button>
      </div>
    </div>
  );
};

export default StudioPreview;