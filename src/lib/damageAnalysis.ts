
/**
 * Utility functions to analyze damage from uploaded images
 */

export interface DamageAnalysisResult {
  type: string;
  confidence: number;
  location: string;
  severity: string;
}

export interface DamageAnalysisResponse {
  success: boolean;
  damages: DamageAnalysisResult[];
  confidence: number;
  error?: string;
  rawVisionData?: any;
}

/**
 * Format damage analysis results into a readable summary
 */
export function formatDamageAnalysisSummary(data: DamageAnalysisResponse): string {
  if (!data.success || !data.damages || data.damages.length === 0) {
    return "No damage detected or analysis failed.";
  }
  
  const lines: string[] = [];
  
  lines.push(`Damage Analysis (Confidence: ${Math.round(data.confidence * 100)}%)`);
  
  data.damages.forEach((damage, index) => {
    lines.push(`${index + 1}. ${damage.type} (${damage.severity})`);
    
    if (damage.location && damage.location !== 'Unknown') {
      lines.push(`   Location: ${damage.location}`);
    }
    
    if (damage.confidence) {
      lines.push(`   Confidence: ${Math.round(damage.confidence * 100)}%`);
    }
  });
  
  return lines.join('\n');
}

/**
 * Get a summary recommendation based on damage analysis
 */
export function getDamageRecommendation(data: DamageAnalysisResponse): string {
  if (!data.success) {
    return "We recommend uploading clearer images of the damage for a more accurate assessment.";
  }
  
  if (data.damages.length === 0) {
    return "No visible damage detected. Please upload clearer images of the damaged area.";
  }
  
  // Calculate average confidence
  const avgConfidence = data.damages.reduce((sum, damage) => sum + damage.confidence, 0) / data.damages.length;
  
  // Check for high severity damages
  const hasSevere = data.damages.some(damage => damage.severity === 'High');
  
  if (avgConfidence > 0.7 && hasSevere) {
    return "Significant damage detected. Your claim has a high likelihood of approval.";
  } else if (avgConfidence > 0.5) {
    return "Damage detected. Your claim will be reviewed by our team.";
  } else {
    return "Potential damage detected. We recommend providing additional details about the damage in your claim description.";
  }
}
