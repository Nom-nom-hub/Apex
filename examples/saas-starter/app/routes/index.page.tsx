import React from 'react';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived';
  lastUpdated: string;
}

interface Metric {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

export async function loader() {
  // In a real implementation, this would fetch from a database
  const projects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      status: 'active',
      lastUpdated: '2023-01-15'
    },
    {
      id: '2',
      name: 'Mobile App',
      status: 'paused',
      lastUpdated: '2023-01-10'
    },
    {
      id: '3',
      name: 'API Integration',
      status: 'active',
      lastUpdated: '2023-01-12'
    }
  ];

  const metrics: Metric[] = [
    {
      name: 'Total Projects',
      value: '12',
      change: '+2',
      changeType: 'positive'
    },
    {
      name: 'Active Users',
      value: '1,254',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Avg. Completion',
      value: '78%',
      change: '-2%',
      changeType: 'negative'
    },
    {
      name: 'Revenue',
      value: '$24,567',
      change: '+8%',
      changeType: 'positive'
    }
  ];

  return { projects, metrics };
}

export default function DashboardPage({ projects, metrics }: { projects: Project[], metrics: Metric[] }) {
  return (
    <div className="py-6">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        
        {/* Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{metric.value}</div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.changeType === 'positive' ? (
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="sr-only">{metric.changeType === 'positive' ? 'Increased' : 'Decreased'} by</span>
                    {metric.change}
                  </div>
                </div>
                <div className="mt-1 text-base text-gray-900">{metric.name}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Recent Projects */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Projects</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Overview of your most recent projects.</p>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : project.status === 'paused' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/projects/${project.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}