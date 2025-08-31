export interface ScheduleOption  {
    immediately?: boolean;
    repeatStrategy?: RepeatStrategy;
    startDate?: string;
    endDate?: string;
    interval?: number;
    limit?: number;
    pattern?: {
      sec?: string;
      min?: string;
      hr?: string;
      dom?: string;
      mon?: string;
      dow?: string;
    };
  };

export interface SchedulePayload {
    scheduleAt: string;
    subject: string;
    htmlContent: string;
    jsonContent: any; // Accepts any JSON
    groups: string[];
    repeatable?: boolean;
    retryAttempts?: number;
    retryStrategy?: RetryStrategy;
    options?: ScheduleOption
  };

// export interface SchedulePayload {
//   email: string;
//   subject: string;
//   htmlContent: string;
//   jsonContent: any;
//   scheduleAt: string;
// }
export interface NewsletterGroup {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum RepeatStrategy {
    EVERY = "every",
    CRON = "cron",
  }
  
export enum RetryStrategy {
    FIXED = "fixed",
    EXPONENTIAL = "exponential",
  }