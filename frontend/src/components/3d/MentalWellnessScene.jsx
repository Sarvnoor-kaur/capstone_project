import { Suspense } from 'react';
import MentalHealthBrain from './MentalHealthBrain';
import MeditationSilhouette from './MeditationSilhouette';
import EmotionalElements from './EmotionalElements';

/**
 * Complete Mental Wellness Scene
 * Combines brain, meditation figure, and emotional elements
 * Represents holistic mental health and emotional wellbeing
 */
export default function MentalWellnessScene() {
  return (
    <Suspense fallback={null}>
      {/* Main brain representing cognitive health */}
      <group position={[0, 1, 0]}>
        <MentalHealthBrain />
      </group>

      {/* Meditation silhouette representing mindfulness */}
      <group position={[0, 0, 2]}>
        <MeditationSilhouette />
      </group>

      {/* Emotional elements floating around */}
      <EmotionalElements />

      {/* Additional ambient light for warmth */}
      <pointLight position={[0, 3, 3]} intensity={0.5} color="#F4CDBB" />
      <pointLight position={[0, -2, -3]} intensity={0.3} color="#A8D8EA" />
    </Suspense>
  );
}
