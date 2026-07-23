import { type ConditionCount } from '../utils/types';

export async function fetchConditionCounts(
  baseUrl: string,
): Promise<ConditionCount[]> {
  try {
    const response = await fetch(`${baseUrl}/api/condition_counts`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch condition counts: ${response.statusText}`,
      );
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching condition counts:', error);
    throw error;
  }
}
