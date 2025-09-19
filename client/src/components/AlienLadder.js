import React from 'react';
import { Trophy, Award, Zap } from 'lucide-react';

const AlienLadder = ({ 
  currentLevel = 1, 
  totalLevels = 5, 
  points = 0, 
  nextLevelPoints = 1000,
  userName = "Employee",
  showProgress = true 
}) => {
  const levels = [
    { name: "Rookie Alien", icon: "👽", color: "bg-gray-500", points: 0 },
    { name: "Junior Explorer", icon: "🛸", color: "bg-blue-500", points: 1000 },
    { name: "Mid-Level Navigator", icon: "🚀", color: "bg-green-500", points: 3000 },
    { name: "Senior Commander", icon: "👨‍🚀", color: "bg-purple-500", points: 6000 },
    { name: "Galactic Leader", icon: "🌟", color: "bg-yellow-500", points: 10000 }
  ];

  const currentLevelData = levels[currentLevel - 1] || levels[0];
  const nextLevelData = levels[currentLevel] || levels[levels.length - 1];
  const progressPercentage = Math.min((points / nextLevelData.points) * 100, 100);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 rounded-xl p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">🚀 Alien Promotion Ladder</h3>
        <p className="text-gray-600">Climb the cosmic career ladder!</p>
      </div>

      {/* Current Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{currentLevelData.icon}</div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{currentLevelData.name}</h4>
              <p className="text-gray-600 text-sm">{userName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-700">{points.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && currentLevel < totalLevels && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress to {nextLevelData.name}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-600">
              {nextLevelData.points - points} points to next level
            </div>
          </div>
        )}
      </div>

      {/* Ladder Visualization */}
      <div className="space-y-3">
        {levels.map((level, index) => {
          const isCurrentLevel = index + 1 === currentLevel;
          const isCompleted = index + 1 < currentLevel;
          const isLocked = index + 1 > currentLevel;
          
          return (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                isCurrentLevel 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg scale-105' 
                  : isCompleted
                  ? 'bg-green-50 border border-green-200'
                  : isLocked
                  ? 'bg-gray-50 border border-gray-200'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {isCompleted ? '✅' : isCurrentLevel ? '🎯' : isLocked ? '🔒' : level.icon}
                </div>
                <div>
                  <div className={`font-semibold ${isCurrentLevel ? 'text-black' : ''}`}>
                    {level.name}
                  </div>
                  <div className={`text-sm ${isCurrentLevel ? 'text-gray-700' : 'text-gray-600'}`}>
                    {level.points.toLocaleString()} points
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isCompleted && <Trophy className="h-5 w-5 text-yellow-500" />}
                {isCurrentLevel && <Zap className="h-5 w-5 text-black" />}
                {isLocked && <div className="text-gray-500">Locked</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievement Badges */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h4 className="text-lg font-semibold mb-3 flex items-center text-gray-900">
          <Award className="h-5 w-5 mr-2 text-yellow-500" />
          Recent Achievements
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
            <div className="text-lg">🏆</div>
            <div className="text-xs text-gray-700">Level Up!</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
            <div className="text-lg">⭐</div>
            <div className="text-xs text-gray-700">Perfect Review</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center">
            <div className="text-lg">🎯</div>
            <div className="text-xs text-gray-700">On-Time</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
            <div className="text-lg">💬</div>
            <div className="text-xs text-gray-700">Voice Review</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlienLadder;
