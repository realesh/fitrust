export type ActivityLevelType =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'very'
  | 'super';

type ActivityItem = {
  title: ActivityLevelType;
  desc: string | null;
};

export type GoalType = 'lose weight' | 'maintain weight' | 'gain weight';

type GoalItem = {
  title: GoalType;
  desc: string | null;
};

export let activityLevels: Array<ActivityItem> = [
  {
    title: 'sedentary',
    desc: 'little to no exercise',
  },
  {
    title: 'light',
    desc: 'light exercise or sports 1-2 days per week',
  },
  {
    title: 'moderate',
    desc: 'moderately exercise or sports 3-5 days per week',
  },
  {
    title: 'very',
    desc: 'hard exercise or sports 6-7 days per week',
  },
  {
    title: 'super',
    desc: 'very hard exercise or sports and physical job',
  },
];

export let goals: Array<GoalItem> = [
  {
    title: 'lose weight',
    desc: null,
  },
  {
    title: 'maintain weight',
    desc: null,
  },
  {
    title: 'gain weight',
    desc: null,
  },
];
