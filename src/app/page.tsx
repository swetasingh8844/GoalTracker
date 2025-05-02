'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, MessageCircle, Trophy, Trash2, Edit, Check, X } from 'lucide-react';

// Define types
type Milestone = {
  id: string;
  title: string;
  completed: boolean;
};

type Comment = {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
};

type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  createdAt: Date;
  dueDate: Date | null;
  milestones: Milestone[];
  comments: Comment[];
};

export default function Home() {
  // State
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalDueDate, setNewGoalDueDate] = useState('');
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [currentUser] = useState('User');
  
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Load sample data on first render
  useEffect(() => {
    const sampleGoals: Goal[] = [
      {
        id: '1',
        title: 'Learn Next.js',
        description: 'Complete a full course on Next.js and build a sample project',
        progress: 65,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        milestones: [
          { id: 'm1', title: 'Complete basic tutorial', completed: true },
          { id: 'm2', title: 'Build a sample app', completed: true },
          { id: 'm3', title: 'Deploy to Vercel', completed: false },
        ],
        comments: [
          { 
            id: 'c1', 
            author: 'Team Lead', 
            text: 'Great progress so far!', 
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) 
          },
        ],
      },
      {
        id: '2',
        title: 'Improve Fitness',
        description: 'Exercise regularly and improve overall fitness levels',
        progress: 40,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        milestones: [
          { id: 'm1', title: 'Start daily walks', completed: true },
          { id: 'm2', title: 'Join a gym', completed: true },
          { id: 'm3', title: 'Run 5k without stopping', completed: false },
          { id: 'm4', title: 'Complete a half-marathon', completed: false },
        ],
        comments: [
          { 
            id: 'c1', 
            author: 'Fitness Coach', 
            text: 'Keep it up! Consistency is key.', 
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) 
          },
          { 
            id: 'c2', 
            author: 'User', 
            text: 'Feeling much better already!', 
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) 
          },
        ],
      },
    ];
    
    setGoals(sampleGoals);
  }, []);

  // Helper functions
  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      description: newGoalDescription,
      progress: 0,
      createdAt: new Date(),
      dueDate: newGoalDueDate ? new Date(newGoalDueDate) : null,
      milestones: [],
      comments: [],
    };
    
    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
    setNewGoalDescription('');
    setNewGoalDueDate('');
    setShowNewGoalForm(false);
  };

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, progress: newProgress } : goal
    ));
  };

  const addMilestone = (goalId: string) => {
    if (!newMilestoneTitle.trim()) return;
    
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestoneTitle,
      completed: false,
    };
    
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, milestones: [...goal.milestones, newMilestone] } 
        : goal
    ));
    
    setNewMilestoneTitle('');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id !== goalId) return goal;
      
      const updatedMilestones = goal.milestones.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, completed: !milestone.completed } 
          : milestone
      );
      
      // Update progress based on completed milestones
      const totalMilestones = updatedMilestones.length;
      const completedMilestones = updatedMilestones.filter(m => m.completed).length;
      const newProgress = totalMilestones > 0 
        ? Math.round((completedMilestones / totalMilestones) * 100) 
        : goal.progress;
      
      return { 
        ...goal, 
        milestones: updatedMilestones,
        progress: newProgress
      };
    }));
  };

  const addComment = (goalId: string) => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      text: newComment,
      timestamp: new Date(),
    };
    
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, comments: [...goal.comments, comment] } 
        : goal
    ));
    
    setNewComment('');
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(null);
    }
  };

  const saveEditedGoal = () => {
    if (!editingGoal) return;
    
    setGoals(goals.map(goal => 
      goal.id === editingGoal.id ? editingGoal : goal
    ));
    
    setEditingGoal(null);
    
    // Update selected goal if it's the one being edited
    if (selectedGoal?.id === editingGoal.id) {
      setSelectedGoal(editingGoal);
    }
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Goal Tracker</h1>
          <div className="flex items-center gap-2">

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Goals List */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Goals</h2>
            <button 
              onClick={() => setShowNewGoalForm(!showNewGoalForm)} 
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <PlusCircle size={20} />
              <span>Add Goal</span>
            </button>
          </div>

          {/* New Goal Form */}
          {showNewGoalForm && (
            <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-2">New Goal</h3>
              <input
                type="text"
                placeholder="Goal Title"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="date"
                placeholder="Due Date"
                value={newGoalDueDate}
                onChange={(e) => setNewGoalDueDate(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowNewGoalForm(false)} 
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={addGoal} 
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Goals List */}
          <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
            {goals.map(goal => (
              <div 
                key={goal.id}
                className={`border rounded-lg p-3 cursor-pointer hover:border-blue-400 transition-colors ${
                  selectedGoal?.id === goal.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedGoal(goal)}
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingGoal({...goal});
                      }} 
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGoal(goal.id);
                      }} 
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{goal.progress}% complete</span>
                    <span>{formatDate(goal.dueDate)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-2 flex justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Trophy size={16} />
                    <span>
                      {goal.milestones.filter(m => m.completed).length} / {goal.milestones.length} milestones
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-600">
                    <MessageCircle size={16} />
                    <span>{goal.comments.length}</span>
                  </div>
                </div>
              </div>
            ))}

            {goals.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>No goals yet. Create your first goal to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Goal Details */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-4">
          {selectedGoal ? (
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedGoal.title}</h2>
              <p className="text-gray-700 mb-4">{selectedGoal.description}</p>
              
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <div>
                  <span className="font-semibold">Created:</span> {formatDate(selectedGoal.createdAt)}
                </div>
                <div>
                  <span className="font-semibold">Due:</span> {formatDate(selectedGoal.dueDate)}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Progress:</span>
                  <span>{selectedGoal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${selectedGoal.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Manual Progress Update */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1">Update Progress Manually:</label>
                <div className="flex gap-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={selectedGoal.progress}
                    onChange={(e) => updateGoalProgress(selectedGoal.id, parseInt(e.target.value))}
                    className="flex-grow"
                  />
                  <span className="text-gray-700">{selectedGoal.progress}%</span>
                </div>
              </div>
              
              {/* Milestones */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Milestones</h3>
                <div className="space-y-2 mb-3">
                  {selectedGoal.milestones.map(milestone => (
                    <div key={milestone.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={milestone.completed}
                        onChange={() => toggleMilestone(selectedGoal.id, milestone.id)}
                        className="h-5 w-5 text-blue-600"
                      />
                      <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                  
                  {selectedGoal.milestones.length === 0 && (
                    <p className="text-gray-500 italic">No milestones yet. Add some to track your progress.</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add new milestone"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    className="flex-grow p-2 border rounded"
                  />
                  <button 
                    onClick={() => addMilestone(selectedGoal.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Comments */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Comments & Feedback</h3>
                <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
                  {selectedGoal.comments.map(comment => (
                    <div key={comment.id} className="border-l-4 border-blue-200 pl-3 py-1">
                      <div className="flex justify-between">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.timestamp).toLocaleDateString()} at {new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                  
                  {selectedGoal.comments.length === 0 && (
                    <p className="text-gray-500 italic">No comments yet. Be the first to leave feedback.</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <textarea 
                    placeholder="Add a comment or feedback"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-grow p-2 border rounded"
                    rows={2}
                  />
                  <button 
                    onClick={() => addComment(selectedGoal.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 h-fit"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16">
              <h2 className="text-xl font-semibold mb-2">No Goal Selected</h2>
              <p>Select a goal from the list to view details or create a new goal to get started.</p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Goal</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input 
                  type="text" 
                  value={editingGoal.title}
                  onChange={(e) => setEditingGoal({...editingGoal, title: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea 
                  value={editingGoal.description}
                  onChange={(e) => setEditingGoal({...editingGoal, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={editingGoal.dueDate ? new Date(editingGoal.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingGoal({
                    ...editingGoal, 
                    dueDate: e.target.value ? new Date(e.target.value) : null
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setEditingGoal(null)} 
                className="px-4 py-2 border rounded hover:bg-gray-100 flex items-center gap-1"
              >
                <X size={16} />
                Cancel
              </button>
              <button 
                onClick={saveEditedGoal} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
              >
                <Check size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}