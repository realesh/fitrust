type Distance = {
  activity:
    | 'total'
    | 'tracker'
    | 'loggedActivities'
    | 'veryActive'
    | 'moderatelyActive'
    | 'lightlyActive'
    | 'sedentaryActive';
  distance: number;
};

export type TodayActivitiesResponseSummary = {
  caloriesBMR: number;
  distances: Array<Distance>;
  steps: number;
  floors: number;
};

export type TodayActivitiesResponse = {
  summary: TodayActivitiesResponseSummary;
};

export const DEFAULT_ACTIVITIES_SUMMARY: TodayActivitiesResponseSummary = {
  caloriesBMR: 0,
  distances: [],
  steps: 0,
  floors: 0,
};

export const DEFAULT_TOTAL_DISTANCES = [
  {
    activity: 'total',
    distance: 0,
  },
];

let fetchTodayActivities = async (
  userID: string,
  accessToken: string,
): Promise<TodayActivitiesResponse> => {
  let response = await fetch(
    `https://api.fitbit.com/1/user/${userID}/activities/date/today.json`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  let responseJson: TodayActivitiesResponse = await response.json();
  return responseJson;
};

export default fetchTodayActivities;
