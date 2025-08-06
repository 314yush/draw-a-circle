export interface Point {
  x: number;
  y: number;
}

export interface Circle {
  centerX: number;
  centerY: number;
  radius: number;
}

export interface CircleAnalysis {
  bestFitCircle: Circle;
  score: number;
  averageDeviation: number;
  maxDeviation: number;
  deviations: number[];
}

// Calculate the best-fit circle using least squares method
export function calculateBestFitCircle(points: Point[]): Circle {
  if (points.length < 3) {
    return { centerX: 0, centerY: 0, radius: 0 };
  }

  // Calculate centroid as initial estimate
  const centroidX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centroidY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  // Calculate average radius from centroid
  const avgRadius = points.reduce((sum, p) => {
    const dx = p.x - centroidX;
    const dy = p.y - centroidY;
    return sum + Math.sqrt(dx * dx + dy * dy);
  }, 0) / points.length;

  return {
    centerX: centroidX,
    centerY: centroidY,
    radius: avgRadius
  };
}

// Analyze how close the drawn path is to a perfect circle
export function analyzeCircle(points: Point[]): CircleAnalysis {
  const bestFitCircle = calculateBestFitCircle(points);
  
  // Calculate deviations from the ideal circle
  const deviations = points.map(point => {
    const dx = point.x - bestFitCircle.centerX;
    const dy = point.y - bestFitCircle.centerY;
    const actualDistance = Math.sqrt(dx * dx + dy * dy);
    return Math.abs(actualDistance - bestFitCircle.radius);
  });

  const averageDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
  const maxDeviation = Math.max(...deviations);

  // Calculate score (0-100) based on how close to perfect the circle is
  const normalizedDeviation = averageDeviation / bestFitCircle.radius;
  const score = Math.max(0, Math.min(100, 100 * (1 - normalizedDeviation * 2)));

  return {
    bestFitCircle,
    score: Math.round(score),
    averageDeviation,
    maxDeviation,
    deviations
  };
}

// Get fun labels based on score
export function getScoreLabel(score: number): string {
  if (score >= 95) return "Circle Sensei 🎯";
  if (score >= 90) return "Ring Master 💍";
  if (score >= 80) return "Curve Crusader ⭕";
  if (score >= 70) return "Round Rookie 🔵";
  if (score >= 60) return "Oval Overlord 🥚";
  if (score >= 50) return "Shape Shifter 🌀";
  if (score >= 40) return "Wobbly Warrior 〰️";
  if (score >= 30) return "Squiggly Squire 🌊";
  if (score >= 20) return "Chaos Creator 💫";
  return "Abstract Artist 🎨";
}
