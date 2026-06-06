import React from 'react';
import ProgressCard from './ProgressCard.jsx';

const DashboardCards = ({ data = {}, user = {} }) => {
  return (
    <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
      <ProgressCard label="Total Questions Solved" value={data?.stats?.totalQuestionsSolved ?? 0} />
      <ProgressCard label="Current Streak" value={`${data?.stats?.currentStreak ?? 0} days`} />
      <ProgressCard label="XP Points" value={`${user?.xp ?? 0} XP`} />
      <ProgressCard label="Readiness Score" value={`${data?.stats?.readinessScore ?? 0}%`} />
    </div>
  );
};

export default DashboardCards;
