import {Intensities} from '../components/IntensityChooser';

export let intensitiesData: Intensities = [
  {
    title: 'Fat Burn',
    level: 0,
    desc:
      'Feels fast but controlled breathing. Enhance general training to make moderate intensity efforts easier & improves efficiency.',
    min: 0.5,
    max: 0.7,
    optimalScore: 900,
  },
  {
    title: 'Cardio',
    level: 1,
    desc:
      'The start of anaerobical zone. Causes muscular fatigue and heavy breathing. Increased ability to sustain high speed endurance.',
    min: 0.7,
    max: 0.85,
    optimalScore: 1000,
  },
  {
    title: 'Peak',
    level: 2,
    desc:
      'For top performance training. Very exhausting for breathing and muscles. For top athletes and only in short intervals.',
    min: 0.85,
    max: 1,
    optimalScore: 1100,
  },
];

export let durationData: Array<number> = [15, 30, 45, 60, 75, 90, 105, 120];
