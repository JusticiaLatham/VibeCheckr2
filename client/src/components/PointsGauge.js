import React, { useState } from 'react';
import { Gift, DollarSign, Clock, Zap, Star, Trophy } from 'lucide-react';

const PointsGauge = ({ 
  currentPoints = 0, 
  userName = "Employee",
  onCashOut = () => {} 
}) => {
  const [selectedReward, setSelectedReward] = useState(null);

  const rewardTiers = [
    { name: "$25 Gift Card", points: 75000, value: 25, icon: "🎁", color: "bg-green-500" },
    { name: "$50 Gift Card", points: 150000, value: 50, icon: "💳", color: "bg-blue-500" },
    { name: "$100 Gift Card", points: 300000, value: 100, icon: "💰", color: "bg-purple-500" },
    { name: "$250 Gift Card", points: 750000, value: 250, icon: "💎", color: "bg-yellow-500" }
  ];

  const availableRewards = rewardTiers.filter(reward => currentPoints >= reward.points);
  const nextReward = rewardTiers.find(reward => currentPoints < reward.points) || rewardTiers[rewardTiers.length - 1];
  const progressToNext = Math.min((currentPoints / nextReward.points) * 100, 100);

  const handleCashOut = (reward) => {
    setSelectedReward(reward);
    onCashOut(reward);
  };

  return (
    <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 text-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center">
          <Gift className="h-6 w-6 mr-2" />
          Points & Rewards
        </h3>
        <p className="text-green-200">Earn points, cash out for rewards!</p>
      </div>

      {/* Current Points Display */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 text-center">
        <div className="text-4xl font-bold text-yellow-400 mb-2">
          {currentPoints.toLocaleString()}
        </div>
        <div className="text-green-200 text-lg">Total Points</div>
        <div className="text-sm text-green-300 mt-1">
          {userName}'s Reward Balance
        </div>
      </div>

      {/* Progress to Next Reward */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress to {nextReward.name}</span>
          <span>{Math.round(progressToNext)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressToNext}%` }}
          ></div>
        </div>
        <div className="text-center text-sm text-green-200">
          {nextReward.points - currentPoints} points to next reward
        </div>
      </div>

      {/* Available Rewards */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-400" />
          Available Rewards
        </h4>
        {availableRewards.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {availableRewards.map((reward, index) => (
              <div 
                key={index}
                className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/20 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{reward.icon}</div>
                    <div>
                      <div className="font-semibold">{reward.name}</div>
                      <div className="text-sm text-green-200">{reward.points.toLocaleString()} points</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCashOut(reward)}
                    className="btn btn-sm bg-yellow-400 text-black hover:bg-yellow-300 font-semibold"
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Cash Out
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-green-200">
            <Gift className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Keep earning points to unlock rewards!</p>
          </div>
        )}
      </div>

      {/* Reward Tiers Overview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
          All Reward Tiers
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {rewardTiers.map((reward, index) => {
            const isAvailable = currentPoints >= reward.points;
            const isNext = reward === nextReward;
            
            return (
              <div 
                key={index}
                className={`p-3 rounded-lg text-center transition-all duration-200 ${
                  isAvailable 
                    ? 'bg-green-500/20 border border-green-400' 
                    : isNext
                    ? 'bg-yellow-500/20 border border-yellow-400'
                    : 'bg-gray-500/20 border border-gray-500'
                }`}
              >
                <div className="text-lg mb-1">{reward.icon}</div>
                <div className="text-sm font-semibold">{reward.name}</div>
                <div className="text-xs text-green-200">{reward.points.toLocaleString()} pts</div>
                {isAvailable && (
                  <div className="text-xs text-green-400 mt-1">✓ Available</div>
                )}
                {isNext && !isAvailable && (
                  <div className="text-xs text-yellow-400 mt-1">Next Goal</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cash Out Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">{selectedReward.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Cash Out Confirmation
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cash out {selectedReward.points.toLocaleString()} points 
                for a {selectedReward.name}?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedReward(null)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onCashOut(selectedReward);
                    setSelectedReward(null);
                  }}
                  className="btn btn-primary flex-1"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Confirm Cash Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsGauge;
