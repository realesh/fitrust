import {UserProfileData} from '../../../graphql/queries/profile';

export const infoBMI = {
  title: 'BMI',
  message:
    'Body Mass Index (BMI) is a person’s weight in kilograms divided by the square of height in meters. A high BMI can be an indicator of high body fatness.',
};

export const infoMHR = {
  title: 'MHR',
  message:
    'Max Heart Rate (MHR) is a person’s maximum heart rate. It is used to determine your heart rate zones to make your exercise much more effective to achieve personalized goal',
};

export const infoMission = {
  title: 'Mission',
  message: 'Coming Soon!',
};

export const DEFAULT_USER_PROFILE: UserProfileData = {
  name: '',
  dob: '1990-01-01T17:00:00.000Z',
  titleFirst: '',
  titleMiddle: '',
  titleLast: '',
  points: 0,
  badges: [],
  bmi: 0,
  avatarUrl: '',
};
