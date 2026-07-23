export interface ConditionCount {
  gender: string;
  condition_description: string;
  condition_count: number;
}

export interface PivotedConditionCount {
  condition_description: string;
  male?: number;
  female?: number;
}
