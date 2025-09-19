import React, { useState } from 'react';
import { 
  Slack, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Settings, 
  MessageSquare, 
  Bell, 
  Users, 
  BarChart3,
  Zap,
  Shield,
  Clock,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const SlackPage = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Mock state - in real app, this would come from API
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected, error

  const handleConnectSlack = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    try {
      // Mock OAuth flow - in real app, this would redirect to Slack OAuth
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setConnectionStatus('connected');
      toast.success('Successfully connected to Slack!');
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Failed to connect to Slack. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectSlack = () => {
    setIsConnected(false);
    setConnectionStatus('disconnected');
    toast.success('Disconnected from Slack');
  };

  const slackFeatures = [
    {
      icon: MessageSquare,
      title: 'Survey Distribution',
      description: 'Automatically send pulse surveys to team channels',
      status: 'active'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get notified about survey responses and insights',
      status: 'active'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Sync team members and roles from Slack',
      status: 'pending'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Share survey results and insights in channels',
      status: 'pending'
    },
    {
      icon: Zap,
      title: 'Automated Workflows',
      description: 'Trigger surveys based on Slack activity',
      status: 'pending'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Failed';
      default:
        return 'Not Connected';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'connecting':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Slack Integration</h1>
          <p className="text-secondary-600">Connect your Slack workspace for seamless team engagement</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(connectionStatus)}`}>
            {getStatusIcon(connectionStatus)}
            <span className="ml-2">{getStatusText(connectionStatus)}</span>
          </div>
        </div>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Slack className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                {isConnected ? 'Slack Workspace Connected' : 'Connect Your Slack Workspace'}
              </h3>
              <p className="text-secondary-600">
                {isConnected 
                  ? 'Your Slack workspace is connected and ready to use'
                  : 'Connect your Slack workspace to enable team notifications and survey distribution'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <>
                <button
                  onClick={handleDisconnectSlack}
                  className="btn btn-outline"
                >
                  Disconnect
                </button>
                <button className="btn btn-primary">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>
              </>
            ) : (
              <button
                onClick={handleConnectSlack}
                disabled={isConnecting}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect to Slack
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slackFeatures.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${
                feature.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <feature.icon className={`h-6 w-6 ${
                  feature.status === 'active' ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 text-sm mb-3">
                  {feature.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    feature.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {feature.status === 'active' ? 'Active' : 'Coming Soon'}
                  </span>
                  {feature.status === 'active' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Benefits */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
        <h3 className="text-xl font-bold text-secondary-900 mb-4">Why Connect Slack?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-purple-100 rounded">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-secondary-900">Seamless Communication</h4>
                <p className="text-sm text-secondary-600">Send surveys directly to team channels without leaving Slack</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-purple-100 rounded">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-secondary-900">Smart Notifications</h4>
                <p className="text-sm text-secondary-600">Get instant alerts for survey responses and important insights</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-purple-100 rounded">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-secondary-900">Team Sync</h4>
                <p className="text-sm text-secondary-600">Automatically sync team members and roles from your Slack workspace</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-purple-100 rounded">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-secondary-900">Secure Integration</h4>
                <p className="text-sm text-secondary-600">Enterprise-grade security with OAuth 2.0 authentication</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      {!isConnected && (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">How to Connect</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">Click "Connect to Slack"</h4>
                <p className="text-sm text-secondary-600">This will redirect you to Slack's authorization page</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">Authorize VibeCheckr</h4>
                <p className="text-sm text-secondary-600">Grant necessary permissions for survey distribution and notifications</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">Configure Settings</h4>
                <p className="text-sm text-secondary-600">Choose which channels to use and set up notification preferences</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connected Workspace Info */}
      {isConnected && (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Connected Workspace</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Slack className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">VibeCheckr Demo Workspace</h4>
                <p className="text-sm text-secondary-600">Connected on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                <Clock className="h-3 w-3 inline mr-1" />
                Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlackPage;
