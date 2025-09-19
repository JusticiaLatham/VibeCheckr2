import React, { useState } from 'react';
import { 
  TrendingUp, Star, Rocket, Target, Award, 
  Users, Calendar, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import AlienLadder from '../components/AlienLadder';
import PointsGauge from '../components/PointsGauge';

const CareerProgress = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const mockEmployees = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Developer',
      level: 3,
      totalPoints: 450000,
      reviewsCompleted: 12,
      averageRating: 4.7,
      nextPromotion: 2,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ',
      achievements: ['Quick Reviewer', 'Thoughtful Feedback', 'Team Player']
    },
    {
      id: 2,
      name: 'Alex Chen',
      role: 'Product Manager',
      level: 2,
      totalPoints: 320000,
      reviewsCompleted: 8,
      averageRating: 4.5,
      nextPromotion: 3,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AC',
      achievements: ['Quick Reviewer', 'Strategic Thinker']
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      role: 'UX Designer',
      level: 4,
      totalPoints: 680000,
      reviewsCompleted: 18,
      averageRating: 4.9,
      nextPromotion: 1,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MR',
      achievements: ['Quick Reviewer', 'Thoughtful Feedback', 'Team Player', 'Innovation Leader']
    }
  ];

  const promotionLadder = [
    { level: 1, title: 'Junior', points: 0, reviews: 0 },
    { level: 2, title: 'Mid-Level', points: 100000, reviews: 3 },
    { level: 3, title: 'Senior', points: 250000, reviews: 6 },
    { level: 4, title: 'Lead', points: 500000, reviews: 12 },
    { level: 5, title: 'Principal', points: 750000, reviews: 18 },
    { level: 6, title: 'Director', points: 1000000, reviews: 24 }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: 'Quick Reviewer',
      description: 'Completed 5 reviews in under 3 minutes',
      points: 5000,
      date: '2024-09-15',
      icon: '⚡'
    },
    {
      id: 2,
      title: 'Thoughtful Feedback',
      description: 'Received 4.8+ average rating for feedback quality',
      points: 10000,
      date: '2024-09-10',
      icon: '💭'
    },
    {
      id: 3,
      title: 'Team Player',
      description: 'Completed 10 peer reviews this quarter',
      points: 15000,
      date: '2024-09-05',
      icon: '🤝'
    }
  ];

  const getCurrentLevel = (points) => {
    for (let i = promotionLadder.length - 1; i >= 0; i--) {
      if (points >= promotionLadder[i].points) {
        return promotionLadder[i];
      }
    }
    return promotionLadder[0];
  };

  const getNextLevel = (currentLevel) => {
    const currentIndex = promotionLadder.findIndex(level => level.level === currentLevel);
    return currentIndex < promotionLadder.length - 1 ? promotionLadder[currentIndex + 1] : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">🚀 Career Progress</h1>
          <p className="text-secondary-600">Track your growth and climb the promotion ladder</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-700">Level 3</div>
          <div className="text-sm text-secondary-500">Senior Developer</div>
        </div>
      </div>

      {/* Alien Ladder */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 border border-gray-200 rounded-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Career Journey</h2>
          <p className="text-gray-600">Watch your alien climb the corporate ladder!</p>
        </div>
        <AlienLadder 
          currentLevel={3} 
          totalLevels={6} 
          points={450000} 
          nextLevelPoints={500000}
        />
      </div>

      {/* Points Gauge */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Progress to Next Level</h3>
        <PointsGauge 
          current={450000} 
          target={500000} 
          label="Points to Lead Level"
        />
      </div>

      {/* Promotion Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Current Level</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Level</span>
              <span className="font-semibold text-secondary-900">3 - Senior</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Total Points</span>
              <span className="font-semibold text-secondary-900">450,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Reviews Completed</span>
              <span className="font-semibold text-secondary-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Average Rating</span>
              <span className="font-semibold text-secondary-900">4.7/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Next Level Requirements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Level</span>
              <span className="font-semibold text-gray-700">4 - Lead</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Points Needed</span>
              <span className="font-semibold text-gray-700">50,000 more</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Reviews Needed</span>
              <span className="font-semibold text-gray-700">6 more</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Estimated Time</span>
              <span className="font-semibold text-gray-700">2-3 months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {recentAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <p className="font-medium text-secondary-900">{achievement.title}</p>
                  <p className="text-sm text-secondary-500">{achievement.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600">+{achievement.points.toLocaleString()} points</div>
                <div className="text-xs text-secondary-500">{achievement.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Team Progress</h3>
        <div className="space-y-4">
          {mockEmployees.map((employee) => (
            <div key={employee.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <img 
                  src={employee.avatar} 
                  alt={employee.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-secondary-900">{employee.name}</p>
                  <p className="text-sm text-secondary-500">{employee.role}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-700">Level {employee.level}</div>
                  <div className="text-xs text-secondary-500">Current Level</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600">
                    {employee.totalPoints.toLocaleString()}
                  </div>
                  <div className="text-xs text-secondary-500">Points</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600">{employee.averageRating}</div>
                  <div className="text-xs text-secondary-500">Avg Rating</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600">
                    {employee.nextPromotion}
                  </div>
                  <div className="text-xs text-secondary-500">Reviews to Next Level</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotion Ladder Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Promotion Ladder</h3>
        <div className="space-y-3">
          {promotionLadder.map((level, index) => (
            <div 
              key={level.level}
              className={`flex items-center justify-between p-3 rounded-lg ${
                level.level <= 3 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-secondary-50 border border-secondary-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  level.level <= 3 
                    ? 'bg-green-500 text-white' 
                    : 'bg-secondary-300 text-secondary-600'
                }`}>
                  {level.level}
                </div>
                <div>
                  <p className="font-medium text-secondary-900">{level.title}</p>
                  <p className="text-sm text-secondary-500">
                    {level.points.toLocaleString()} points • {level.reviews} reviews
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                {level.level <= 3 ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Achieved
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerProgress;
