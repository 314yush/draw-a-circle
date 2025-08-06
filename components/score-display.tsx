'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CircleAnalysis, getScoreLabel } from '@/lib/circle-math'

interface ScoreDisplayProps {
  analysis: CircleAnalysis | null
  isVisible: boolean
}

export default function ScoreDisplay({ analysis, isVisible }: ScoreDisplayProps) {
  if (!isVisible || !analysis) return null

  const { score, averageDeviation } = analysis
  const label = getScoreLabel(score)

  return (
    <Card className="w-full mx-auto">
      <CardContent className="p-4 text-center">
        <div className="mb-4">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {score}%
          </div>
          <div className="text-lg font-semibold text-gray-700 mb-2">
            {label}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div className="text-center">
            <div className="font-medium">Deviation</div>
            <div>{averageDeviation.toFixed(1)}px</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Radius</div>
            <div>{analysis.bestFitCircle.radius.toFixed(1)}px</div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {score >= 90 && "Incredible! You have steady hands! 🎯"}
            {score >= 70 && score < 90 && "Great job! That's a solid circle! 👏"}
            {score >= 50 && score < 70 && "Not bad! Keep practicing! 💪"}
            {score < 50 && "Everyone starts somewhere! Try again! 🌟"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
