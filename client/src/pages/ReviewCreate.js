import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  Star,
  Mic,
  CheckCircle,
  AlertCircle,
  Building2,
  User
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ReviewCreate = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for templates and employees
  const templates = [
    {
      id: 'template-1',
      name: 'Weekly Peer Review',
      description: 'Quick weekly feedback between team members',
      estimatedTime: 5,
      questions: 4,
      type: 'peer_review'
    },
    {
      id: 'template-2', 
      name: 'Monthly Performance Review',
      description: 'Comprehensive monthly performance assessment',
      estimatedTime: 15,
      questions: 8,
      type: 'manager_review'
    },
    {
      id: 'template-3',
      name: '360 Feedback Review',
      description: 'Multi-directional feedback from peers, managers, and reports',
      estimatedTime: 20,
      questions: 12,
      type: '360_review'
    }
  ];

  const employees = [
    { id: 'emp-1', name: 'Alex Chen', role: 'Software Engineer', department: 'Engineering', avatar: 'AC' },
    { id: 'emp-2', name: 'Maria Rodriguez', role: 'Product Manager', department: 'Product', avatar: 'MR' },
    { id: 'emp-3', name: 'David Kim', role: 'UX Designer', department: 'Design', avatar: 'DK' },
    { id: 'emp-4', name: 'Sarah Johnson', role: 'Marketing Manager', department: 'Marketing', avatar: 'SJ' },
    { id: 'emp-5', name: 'Mike Wilson', role: 'Sales Director', department: 'Sales', avatar: 'MW' }
  ];

  const handleEmployeeToggle = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTemplate) {
      toast.error('Please select a review template');
      return;
    }
    
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee to review');
      return;
    }
    
    if (!dueDate) {
      toast.error('Please set a due date');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock API call - in real app, this would create the reviews
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Created ${selectedEmployees.length} review(s) successfully!`);
      navigate('/reviews');
    } catch (error) {
      toast.error('Failed to create reviews. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  const selectedEmployeesData = employees.filter(emp => selectedEmployees.includes(emp.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/reviews" 
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-secondary-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Create New Review</h1>
          <p className="text-secondary-600">Set up a new employee review cycle</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Template Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Select Review Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-secondary-900">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  )}
                </div>
                <p className="text-sm text-secondary-600 mb-3">{template.description}</p>
                <div className="flex items-center space-x-4 text-xs text-secondary-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{template.estimatedTime}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>{template.questions} questions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Select Employees to Review</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {employees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => handleEmployeeToggle(employee.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedEmployees.includes(employee.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-700">{employee.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">{employee.name}</p>
                    <p className="text-xs text-secondary-500 truncate">{employee.role}</p>
                    <p className="text-xs text-secondary-400 truncate">{employee.department}</p>
                  </div>
                  {selectedEmployees.includes(employee.id) && (
                    <CheckCircle className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
          {selectedEmployees.length > 0 && (
            <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-700">
                <strong>{selectedEmployees.length}</strong> employee{selectedEmployees.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </div>

        {/* Review Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Review Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Review Type
              </label>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-sm text-secondary-600">
                  {selectedTemplateData?.type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Select a template'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Summary */}
        {selectedTemplate && selectedEmployees.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200 p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Review Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Star className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-900">Template</p>
                  <p className="text-sm text-primary-700">{selectedTemplateData?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-900">Employees</p>
                  <p className="text-sm text-primary-700">{selectedEmployees.length} selected</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Clock className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-900">Est. Time</p>
                  <p className="text-sm text-primary-700">{selectedTemplateData?.estimatedTime} minutes each</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-200">
          <Link 
            to="/reviews" 
            className="btn btn-outline"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!selectedTemplate || selectedEmployees.length === 0 || !dueDate || isSubmitting}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating Reviews...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create {selectedEmployees.length} Review{selectedEmployees.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewCreate;
