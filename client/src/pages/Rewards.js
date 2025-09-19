import React, { useState } from 'react';
import { 
  Gift, Trophy, Star, Coins, ShoppingCart, 
  Award, Target, TrendingUp, Clock, Zap
} from 'lucide-react';

const Rewards = () => {
  const [selectedReward, setSelectedReward] = useState(null);

  const mockRewards = [
    {
      id: 1,
      name: 'Amazon Gift Card',
      description: 'Redeem points for Amazon gift cards',
      cost: 150000,
      icon: '🛒',
      category: 'gift-cards',
      available: true
    },
    {
      id: 2,
      name: 'Extra Day Off',
      description: 'Take an extra paid day off',
      cost: 200000,
      icon: '🏖️',
      category: 'time-off',
      available: true
    },
    {
      id: 3,
      name: 'Lunch with CEO',
      description: 'One-on-one lunch with the CEO',
      cost: 300000,
      icon: '🍽️',
      category: 'experiences',
      available: true
    },
    {
      id: 4,
      name: 'Conference Pass',
      description: 'Attend any industry conference',
      cost: 250000,
      icon: '🎤',
      category: 'learning',
      available: true
    },
    {
      id: 5,
      name: 'Home Office Setup',
      description: '$500 towards home office equipment',
      cost: 400000,
      icon: '💻',
      category: 'equipment',
      available: true
    },
    {
      id: 6,
      name: 'Team Dinner',
      description: 'Take your team out for dinner',
      cost: 500000,
      icon: '🍕',
      category: 'team-building',
      available: true
    }
  ];

  const userPoints = 125000;
  const nextReward = mockRewards.find(r => r.cost > userPoints);

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
  };

  const confirmRedeem = () => {
    // In a real app, this would make an API call
    console.log('Redeeming reward:', selectedReward);
    setSelectedReward(null);
    // Show success message
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">🎁 Rewards</h1>
          <p className="text-secondary-600">Redeem your points for amazing rewards</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-purple-600">{userPoints.toLocaleString()}</div>
          <div className="text-sm text-secondary-500">Total Points</div>
        </div>
      </div>

      {/* Points Gauge */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Your Points Balance</h2>
            <p className="text-purple-100">Keep earning to unlock more rewards!</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{userPoints.toLocaleString()}</div>
            <div className="text-purple-100">Points Available</div>
          </div>
        </div>
        
        {nextReward && (
          <div className="mt-4 p-4 bg-white/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Next Reward: {nextReward.name}</p>
                <p className="text-sm text-purple-100">
                  {(nextReward.cost - userPoints).toLocaleString()} more points needed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{nextReward.cost.toLocaleString()}</div>
                <div className="text-sm text-purple-100">Points Required</div>
              </div>
            </div>
            <div className="mt-3 w-full bg-white/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${(userPoints / nextReward.cost) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRewards.map((reward) => (
          <div 
            key={reward.id} 
            className={`bg-white rounded-lg shadow-sm border p-6 ${
              userPoints >= reward.cost 
                ? 'border-green-200 hover:border-green-300' 
                : 'border-secondary-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{reward.icon}</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {reward.cost.toLocaleString()}
                </div>
                <div className="text-sm text-secondary-500">Points</div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {reward.name}
            </h3>
            <p className="text-secondary-600 text-sm mb-4">
              {reward.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                reward.category === 'gift-cards' ? 'bg-blue-100 text-blue-800' :
                reward.category === 'time-off' ? 'bg-green-100 text-green-800' :
                reward.category === 'experiences' ? 'bg-purple-100 text-purple-800' :
                reward.category === 'learning' ? 'bg-yellow-100 text-yellow-800' :
                reward.category === 'equipment' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {reward.category.replace('-', ' ')}
              </span>
              
              <button
                onClick={() => handleRedeem(reward)}
                disabled={userPoints < reward.cost}
                className={`btn btn-sm ${
                  userPoints >= reward.cost 
                    ? 'btn-primary' 
                    : 'btn-outline opacity-50 cursor-not-allowed'
                }`}
              >
                {userPoints >= reward.cost ? 'Redeem' : 'Not Enough Points'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Redemptions */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Redemptions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🛒</div>
              <div>
                <p className="font-medium text-secondary-900">Amazon Gift Card - $25</p>
                <p className="text-sm text-secondary-500">Redeemed 2 days ago</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-purple-600">-150,000 points</div>
              <div className="text-xs text-secondary-500">Completed</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏖️</div>
              <div>
                <p className="font-medium text-secondary-900">Extra Day Off</p>
                <p className="text-sm text-secondary-500">Redeemed 1 week ago</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-purple-600">-200,000 points</div>
              <div className="text-xs text-secondary-500">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Modal */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{selectedReward.icon}</div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">
                Redeem {selectedReward.name}
              </h3>
              <p className="text-secondary-600">
                This will cost you {selectedReward.cost.toLocaleString()} points
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg mb-6">
              <div>
                <p className="font-medium text-secondary-900">Current Balance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {userPoints.toLocaleString()} points
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-secondary-900">After Redemption</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(userPoints - selectedReward.cost).toLocaleString()} points
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedReward(null)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedeem}
                className="btn btn-primary flex-1"
              >
                Confirm Redemption
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
