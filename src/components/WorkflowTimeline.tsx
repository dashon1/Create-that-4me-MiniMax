import { Check } from 'lucide-react'

interface WorkflowStage {
  name: string
  progress: number
}

export function WorkflowTimeline() {
  const stages: WorkflowStage[] = [
    { name: 'Pre-Production', progress: 100 },
    { name: 'Script', progress: 100 },
    { name: 'Location', progress: 65 },
    { name: 'Team', progress: 0 },
    { name: 'Review', progress: 0 },
    { name: 'Publishing', progress: 0 },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Workflow Timeline
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        Track your content production progress across all stages
      </p>

      <div className="relative">
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Stage Circle */}
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    stage.progress === 100
                      ? 'bg-green-500'
                      : stage.progress > 0
                      ? 'bg-indigo-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  {stage.progress === 100 ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {stage.progress > 0 ? `${stage.progress}%` : ''}
                    </span>
                  )}
                </div>

                {/* Connecting Line */}
                {index < stages.length - 1 && (
                  <div
                    className={`absolute top-6 left-12 h-0.5 ${
                      stage.progress === 100
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    style={{ width: 'calc(100% + 20px)' }}
                  />
                )}
              </div>

              {/* Stage Name */}
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-3 text-center">
                {stage.name}
              </p>
              {stage.progress > 0 && stage.progress < 100 && (
                <p className="text-xs text-gray-500 mt-1">{stage.progress}%</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
