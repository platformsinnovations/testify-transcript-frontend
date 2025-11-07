'use client'

const AnalyticsProgressCard = ({ 
  title, 
  percentage, 
  color = '#04BF68',
  showDonut = false,
  size = 'default',
  showLegend = false
}) => {
  const radius = size === 'large' ? 80 : 60
  const circumference = 2 * Math.PI * radius
  const progress = ((100 - percentage) / 100) * circumference
  const svgSize = size === 'large' ? 200 : 180

  const legendItems = [
    { label: 'Pending', color: 'bg-blue-500' },
    { label: 'Approved', color: 'bg-green-500' },
    { label: 'Declined', color: 'bg-red-500' },
    { label: 'Processing', color: 'bg-yellow-500' }
  ]

  return (
    <div className={`rounded-lg bg-white ${title ? 'p-6' : 'p-0'} shadow-sm`}>
      {title && <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>}
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center">
          {showDonut ? (
            <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
              <circle
                cx={svgSize/2}
                cy={svgSize/2}
                r={radius}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="20"
              />
              <circle
                cx={svgSize/2}
                cy={svgSize/2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                transform={`rotate(-90 ${svgSize/2} ${svgSize/2})`}
              />
              <text
                x={svgSize/2}
                y={svgSize/2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="24"
                fontWeight="bold"
                fill="#111827"
              >
                {percentage}%
              </text>
            </svg>
          ) : (
            <svg width="180" height="100" viewBox="0 0 180 100">
              <path
                d="M10 90 A80 80 0 0 1 170 90"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M10 90 A80 80 0 0 1 170 90"
                fill="none"
                stroke={color}
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                transform="rotate(-180 90 90)"
              />
              <text
                x="90"
                y="85"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                fill="#111827"
              >
                {percentage}%
              </text>
            </svg>
          )}
        </div>
        {showLegend && (
          <div className="mt-4 grid grid-cols-2 gap-2 w-full">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsProgressCard