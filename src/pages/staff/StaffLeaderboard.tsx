import React, { useState } from 'react';
import { Leaderboard } from '../../components/gamification/Leaderboard';

export const StaffLeaderboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  return (
    <div className="space-y-6">
      <Leaderboard
        staffStats={[]} // Will use mock data from component
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
      />
    </div>
  );
};