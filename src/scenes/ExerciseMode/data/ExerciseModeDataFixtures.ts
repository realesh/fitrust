import {Intensities} from '../components/IntensityChooser';

export let intensitiesData: Intensities = [
  // {
  //   title: 'Light',
  //   level: 0,
  //   desc:
  //     'For endurance training, easy and aerobic. Feels easy and aerobic. Improves general base fitness, recovery and metabolism.',
  // },
  {
    title: 'Fat Burn',
    level: 0,
    desc:
      'Feels fast but controlled breathing. Enhance general training to make moderate intensity efforts easier & improves efficiency.',
    min: 94,
    max: 132,
  },
  {
    title: 'Cardio',
    level: 1,
    desc:
      'The start of anaerobical zone. Causes muscular fatigue and heavy breathing. Increased ability to sustain high speed endurance.',
    min: 132,
    max: 160,
  },
  {
    title: 'Peak',
    level: 2,
    desc:
      'For top performance training. Very exhausting for breathing and muscles. For top athletes and only in short intervals.',
    min: 160,
    max: 220,
  },
];

export let durationData: Array<number> = [15, 30, 45, 60, 75, 90, 105, 120];