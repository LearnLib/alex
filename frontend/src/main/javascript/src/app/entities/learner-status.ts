import { LearnerResult } from './learner-result';

export interface LearnerProcessStatus {
  result: LearnerResult;
  phase: string;
  currentQueries: any[];
}

export interface LearnerStatus {
  currentProcess: LearnerProcessStatus,
  queue: LearnerResult[]
  active: boolean;
}
