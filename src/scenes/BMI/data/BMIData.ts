import {bmiScaleColor} from '../../../generals/constants/colors';

export type BMIScale = {
  title: string;
  min: number;
  max: number;
  desc: string;
  color: string;
};

export const bmiScaleList: Array<BMIScale> = [
  {
    title: 'Underweight',
    min: 0,
    max: 18.5,
    desc:
      "Underweight could be a sign you're not eating enough or you may be ill. Try increase your weight to get healthy!",
    color: bmiScaleColor.under,
  },
  {
    title: 'Healthy',
    min: 18.5,
    max: 25,
    desc:
      'Keep up the good work! Keep eating a balanced diet and maintain working out to stay in shape!',
    color: bmiScaleColor.healthy,
  },
  {
    title: 'Overweight',
    min: 25,
    max: 30,
    desc:
      'Best way to lose weight is through a combination of diet and exercise. Start to get healthy!',
    color: bmiScaleColor.over,
  },
  {
    title: 'Obese',
    min: 30,
    max: Math.pow(10, 10),
    desc:
      'Being obese means that you are away from being healthy. Start losing weight and contact experts if needed.',
    color: bmiScaleColor.obese,
  },
];
