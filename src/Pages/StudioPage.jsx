import React from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import StudioPreview from '../components/studio/StudioPreview';
import { Crown } from 'lucide-react';

const StudioDashboard = () => (
    <div>
        <h1 className="font-heading text-4xl font-bold mb-4">Welcome to the Studio</h1>
        <p className="text-muted-foreground mb-8">This is your strategic command center. (Full features coming soon)</p>
        <div className="p-8 bg-secondary/30 rounded-xl border border-border">
            <h2 className="text-2xl font-bold font-heading mb-4">Six-Category Allocator</h2>
            <p>Here you would find the advanced 6-category system for strategic deployment.</p>
        </div>
    </div>
);

const StudioPage = () => {
    const userTier = useFinancialStore(state => state.user.tier);
    const isPremium = userTier === 'STUDIO';

    return (
        <div>
            {isPremium ? <StudioDashboard /> : <StudioPreview />}
        </div>
    );
};

export default StudioPage;