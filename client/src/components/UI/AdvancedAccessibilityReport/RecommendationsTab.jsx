import React from 'react';

const RecommendationsTab = ({ report }) => {
  const recommendations = [
    {
      priority: 'High',
      title: 'Improve Color Contrast',
      description: 'Several text elements fail WCAG contrast requirements. Increase contrast between text and background colors.',
      impact: 'Legal compliance and user experience'
    },
    {
      priority: 'Medium',
      title: 'Add Alternative Text',
      description: 'Ensure all meaningful images have descriptive alt text for screen readers.',
      impact: 'Screen reader accessibility'
    },
    {
      priority: 'Low',
      title: 'Consider Color Blindness',
      description: 'Test design with different color vision deficiencies to ensure usability.',
      impact: 'Color blind users'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h4 className="text-lg font-medium text-zinc-100 mb-4 flex items-center gap-2">
          💡 Accessibility Recommendations
        </h4>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
              <div className="flex items-start gap-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  rec.priority === 'High' ? 'bg-red-900 text-red-300' :
                  rec.priority === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-green-900 text-green-300'
                }`}>
                  {rec.priority}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-zinc-100 mb-1">{rec.title}</div>
                  <div className="text-sm text-zinc-400 mb-2">{rec.description}</div>
                  <div className="text-xs text-zinc-500">Impact: {rec.impact}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default RecommendationsTab;
