type DataItem = {
  time: string;
  value: number;
};

type HeartActivitesIntraday = {
  dataset?: Array<DataItem>;
};

export type HeartActivitiesResponse = {
  'activities-heart-intraday'?: HeartActivitesIntraday;
};

let fetchExerciseMode = async (
  userID: string,
  accessToken: string,
  startTime: string,
  finishTime: string,
  date: string,
): Promise<HeartActivitiesResponse> => {
  let response = await fetch(
    `https://api.fitbit.com/1/user/${userID}/activities/heart/date/${date}/1d/1min/time/${startTime}/${finishTime}.json`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  let responseJson: HeartActivitiesResponse = await response.json();
  return responseJson;
};

export default fetchExerciseMode;
