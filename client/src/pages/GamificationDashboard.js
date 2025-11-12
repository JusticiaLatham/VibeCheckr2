import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Trophy, 
  Star, 
  Gift, 
  Zap, 
  Award, 
  TrendingUp, 
  Users, 
  Calendar,
  Rocket,
  Target,
  Crown,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import AlienLadder from '../components/AlienLadder';
import PointsGauge from '../components/PointsGauge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const GamificationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const mockUserData = {
    name: "Sarah Johnson",
    currentLevel: 3,
    totalLevels: 5,
    points: 4500,
    nextLevelPoints: 6000,
    totalPointsEarned: 12500,
    reviewsCompleted: 8,
    perfectReviews: 3,
    onTimeReviews: 7,
    voiceReviews: 2,
    currentStreak: 4,
    longestStreak: 6
  };

  const mockLeaderboard = [
    { name: "Alex Chen", points: 8500, level: 4, avatar: "AC" },
    { name: "Maria Rodriguez", points: 7200, level: 3, avatar: "MR" },
    { name: "Sarah Johnson", points: 4500, level: 3, avatar: "SJ" },
    { name: "Mike Smith", points: 3800, level: 2, avatar: "MS" },
    { name: "Lisa Wang", points: 2900, level: 2, avatar: "LW" }
  ];

  const mockAchievements = [
    { name: "First Review", description: "Complete your first review", icon: "🎯", earned: true, date: "2024-01-15" },
    { name: "Perfect Score", description: "Get a perfect 5-star review", icon: "⭐", earned: true, date: "2024-02-03" },
    { name: "Voice Master", description: "Complete 5 voice reviews", icon: "🎤", earned: false, progress: 2 },
    { name: "Streak Master", description: "Complete 10 reviews in a row", icon: "🔥", earned: false, progress: 4 },
    { name: "Team Player", description: "Complete 20 peer reviews", icon: "👥", earned: false, progress: 8 },
    { name: "Galactic Leader", description: "Reach the highest level", icon: "👑", earned: false, progress: 0 }
  ];

  const handleCashOut = (reward) => {
    console.log('Cashing out:', reward);
    toast.success(`Successfully cashed out ${reward.points.toLocaleString()} points for ${reward.name}!`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Trophy },
    { id: 'ladder', label: 'Alien Ladder', icon: Rocket },
    { id: 'rewards', label: 'Points & Rewards', icon: Gift },
    { id: 'leaderboard', label: 'Leaderboard', icon: Users },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">🎮 Engagement Dashboard</h1>
          <p className="text-secondary-600">Track your progress, earn rewards, and climb the alien ladder!</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-secondary-600">
          <Sparkles className="h-4 w-4" />
          <span>Level {mockUserData.currentLevel} • {mockUserData.points.toLocaleString()} points</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Current Level</p>
                      <p className="text-2xl font-bold">{mockUserData.currentLevel}</p>
                    </div>
                    <Rocket className="h-8 w-8 text-blue-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Points</p>
                      <p className="text-2xl font-bold">{mockUserData.points.toLocaleString()}</p>
                    </div>
                    <Star className="h-8 w-8 text-green-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Reviews Done</p>
                      <p className="text-2xl font-bold">{mockUserData.reviewsCompleted}</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Current Streak</p>
                      <p className="text-2xl font-bold">{mockUserData.currentStreak}</p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-200" />
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {mockAchievements.filter(a => a.earned).slice(0, 3).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-secondary-900">{achievement.name}</div>
                        <div className="text-sm text-secondary-600">{achievement.description}</div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full btn bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Target className="h-4 w-4 mr-2" />
                    Start New Review
                  </button>
                  <button className="w-full btn bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Gift className="h-4 w-4 mr-2" />
                    View Rewards
                  </button>
                  <button className="w-full btn bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Users className="h-4 w-4 mr-2" />
                    See Leaderboard
                  </button>
                </div>
              </div>

              {/* Next Goals */}
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Next Goals</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Reach Level 4</span>
                    <span className="text-sm font-medium text-primary-600">
                      {mockUserData.nextLevelPoints - mockUserData.points} points to go
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Voice Master Badge</span>
                    <span className="text-sm font-medium text-primary-600">
                      {5 - 2} more voice reviews
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">$25 Gift Card</span>
                    <span className="text-sm font-medium text-primary-600">
                      {75000 - mockUserData.points} points to go
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alien Ladder Tab */}
        {activeTab === 'ladder' && (
          <div className="max-w-4xl mx-auto">
            <AlienLadder 
              currentLevel={mockUserData.currentLevel}
              totalLevels={mockUserData.totalLevels}
              points={mockUserData.points}
              nextLevelPoints={mockUserData.nextLevelPoints}
              userName={mockUserData.name}
              showProgress={true}
            />
          </div>
        )}

        {/* Points & Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="max-w-4xl mx-auto">
            <PointsGauge 
              currentPoints={mockUserData.points}
              userName={mockUserData.name}
              onCashOut={handleCashOut}
            />
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">🏆 Company Leaderboard</h2>
              <p className="text-yellow-100 text-lg">See how you stack up against your colleagues!</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
              <div className="p-6 border-b border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900">Top Performers</h3>
              </div>
              <div className="divide-y divide-secondary-200">
                {mockLeaderboard.map((person, index) => (
                  <div key={index} className="p-6 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-lg">
                          {index < 3 ? ['🥇', '🥈', '🥉'][index] : person.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-secondary-900">{person.name}</div>
                          <div className="text-sm text-secondary-600">Level {person.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-secondary-900">
                          {person.points.toLocaleString()}
                        </div>
                        <div className="text-sm text-secondary-600">points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">🏅 Achievement Gallery</h2>
              <p className="text-purple-100 text-lg">Unlock badges and show off your accomplishments!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAchievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`rounded-lg p-6 border-2 transition-all duration-200 ${
                    achievement.earned 
                      ? 'bg-green-50 border-green-200 shadow-md' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className={`font-semibold mb-2 ${
                      achievement.earned ? 'text-green-900' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      achievement.earned ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    {achievement.earned ? (
                      <div className="flex items-center justify-center text-green-600 font-medium">
                        <Crown className="h-4 w-4 mr-1" />
                        Earned {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(achievement.progress / 5) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {achievement.progress}/5 completed
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationDashboard;
