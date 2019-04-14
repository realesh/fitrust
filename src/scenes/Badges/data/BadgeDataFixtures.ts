export type BadgeItem = {
  name: string;
  desc: string;
  thumbUri: string;
  unlocked: boolean;
};

export const badgesList: Array<BadgeItem> = [
  {
    name: 'Maximum Rate',
    desc: 'Record your first MHR',
    thumbUri:
      'https://d22ir9aoo7cbf6.cloudfront.net/wp-content/uploads/sites/2/2017/04/honeycombers-personal-trainer-gym-n-tonic.jpg',
    unlocked: true,
  },
  {
    name: 'Number One',
    desc: 'Be the first on leaderboard',
    thumbUri:
      'https://d22ir9aoo7cbf6.cloudfront.net/wp-content/uploads/sites/2/2017/04/honeycombers-personal-trainer-gym-n-tonic.jpg',
    unlocked: false,
  },
  {
    name: 'Grand Walker',
    desc: 'Record 10.000 steps in a day',
    thumbUri:
      'https://d22ir9aoo7cbf6.cloudfront.net/wp-content/uploads/sites/2/2017/04/honeycombers-personal-trainer-gym-n-tonic.jpg',
    unlocked: false,
  },
];
