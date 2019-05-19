import {
  NUTRITIONIX_APP_ID,
  NUTRITIONIX_APP_KEY,
} from '../../generals/constants/nutritionix';

export type WorkoutDetail = {
  name: string;
  duration_min: number;
  nf_calories: number;
  photo: {
    thumb: string;
  };
};

export type SearchResponse = {
  exercises: Array<WorkoutDetail>;
};

let fetchExerciseSearch = async (query: string): Promise<SearchResponse> => {
  let queryBody = {
    query,
  };
  let response = await fetch(
    'https://trackapi.nutritionix.com/v2/natural/exercise',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_APP_KEY,
        'x-remote-user-id': '0',
      },
      body: JSON.stringify(queryBody),
    },
  );

  let responseJson: SearchResponse = await response.json();
  return responseJson;
};

export default fetchExerciseSearch;
