import { type ConditionCount, type PivotedConditionCount } from './types';

export function pivotByCondition(
  rows: ConditionCount[],
): PivotedConditionCount[] {
  const grouped: Record<string, PivotedConditionCount> = {};

  rows.forEach(({ gender, condition_description, condition_count }) => {
    if (!grouped[condition_description]) {
      grouped[condition_description] = { condition_description };
    }

    if (gender === 'male' || gender === 'female') {
      grouped[condition_description][gender] = condition_count;

      grouped[condition_description].male ??= 0;
      grouped[condition_description].female ??= 0;
    }
  });

  return Object.values(grouped);
}

export function sortByTotalCount(
  data: PivotedConditionCount[],
): PivotedConditionCount[] {
  return data.sort(
    (a, b) =>
      (b.male ?? 0) + (b.female ?? 0) - ((a.male ?? 0) + (a.female ?? 0)),
  );
}

export function limitTopNConditions(
  data: PivotedConditionCount[],
  n: number,
): PivotedConditionCount[] {
  return data.slice(0, n);
}
