export type SettingsItem = {
  title: string;
  subtitle: string;
  goTo: string;
};

export const settingsItems: Array<SettingsItem> = [
  {
    title: 'Calculate BMI',
    subtitle:
      'Calculation to indicate whether you have the right weight for your height',
    goTo: 'BMRCalculator',
  },
  {
    title: 'Calculate BMR',
    subtitle: 'This will tell you how many calories should you take in a day',
    goTo: 'BMRCalculator',
  },
  {
    title: 'Calculate MHR',
    subtitle: 'Your own Maxium Heart Rate, useful for an effective workout',
    goTo: 'BMRCalculator',
  },
];
