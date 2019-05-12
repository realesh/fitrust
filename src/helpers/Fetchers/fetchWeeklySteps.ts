import moment from 'moment';

type Step = {
  dateTime: string;
  value: string;
};

export type WeeklyStepsResponse = {
  'activities-steps': Array<Step>;
};

let fetchThisWeekSteps = async (
  userID: string,
  accessToken: string,
): Promise<WeeklyStepsResponse> => {
  let endWeek = moment().endOf('isoWeek');
  let endWeekString = [
    endWeek.get('year'),
    endWeek.get('month') + 1 < 10
      ? '0' + (endWeek.get('month') + 1)
      : endWeek.get('month') + 1,
    endWeek.get('date') < 10 ? '0' + endWeek.get('date') : endWeek.get('date'),
  ].join('-');

  let thisWeekResponse = await fetch(
    `https://api.fitbit.com/1/user/${userID}/activities/steps/date/${endWeekString}/1w.json`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  let responseJson: WeeklyStepsResponse = await thisWeekResponse.json();
  return responseJson;
};

let fetchLastWeekSteps = async (
  userID: string,
  accessToken: string,
): Promise<WeeklyStepsResponse> => {
  let lastEndWeek = moment()
    .subtract(1, 'weeks')
    .endOf('isoWeek');
  let lastEndWeekString = [
    lastEndWeek.get('year'),
    lastEndWeek.get('month') + 1 < 10
      ? '0' + (lastEndWeek.get('month') + 1)
      : lastEndWeek.get('month') + 1,
    lastEndWeek.get('date') < 10
      ? '0' + lastEndWeek.get('date')
      : lastEndWeek.get('date'),
  ].join('-');

  let lastWeekResponse = await fetch(
    `https://api.fitbit.com/1/user/${userID}/activities/steps/date/${lastEndWeekString}/1w.json`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  let responseJson: WeeklyStepsResponse = await lastWeekResponse.json();
  return responseJson;
};

export {fetchThisWeekSteps, fetchLastWeekSteps};
