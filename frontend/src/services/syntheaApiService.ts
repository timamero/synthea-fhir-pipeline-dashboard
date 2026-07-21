interface ConditionCountsResponse {
  gender: string;
  condition_description: string;
  condition_count: number;
}

export async function fetchConditionCounts(
  baseUrl: string,
): Promise<ConditionCountsResponse[]> {
  const response = await fetch(`${baseUrl}/condition_counts`);
  if (!response.ok) {
    throw new Error(`Failed to fetch condition counts: ${response.statusText}`);
  }
  return response.json();
}
