import { RepeatStrategy, RetryStrategy } from "@/types";
import { z } from "zod";


const retryStrategyEnum = z.nativeEnum(RetryStrategy); // Adjust as needed
const repeatStrategyEnum = z.nativeEnum(RepeatStrategy); // Adjust as needed

const patternSchema = z.object({
  sec: z.string().optional().default("*"),
  min: z.string().optional().default("*"),
  hr: z.string().optional().default("*"),
  dom: z.string().optional().default("*"),
  mon: z.string().optional().default("*"),
  dow: z.string().optional().default("*"),
});

const optionsSchema = z
  .object({
    immediately: z.boolean().optional().default(false),
    repeatStrategy: repeatStrategyEnum.optional(),
    startDate: z
      .string()
      .refine((dateString) => {
        const date = new Date(dateString);
        return (
          !isNaN(date.getTime()) &&
          date.getTime() >= Date.now() + 3 * 60 * 1000
        );
      }, "Start Date must be a valid date string and at least 3 minutes in the future")
      .optional(),
    endDate: z
      .string()
      .optional(),
    interval: z.number().optional(),
    limit: z.number().optional(),
    pattern: patternSchema.optional(),
  })
  .refine((data) => {
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate.getTime() >= startDate.getTime() + 10 * 60 * 1000;
    }
    return true;
  }, "End Date must be at least 10 minutes greater than Start Date if both are provided.");

  export const JobScheduleSchema = z
  .object({
    groups: z.array(z.string()).min(1, "At least one group is required"),
    repeatable: z.boolean().optional(),
    retryAttempts: z.number({ message: "RetryAttempts must be a number" }).int().nonnegative().optional(),
    retryStrategy: retryStrategyEnum.optional(),
    options: optionsSchema.optional(),
    subject: z.string().min(5, "Subject must be at least 5 characters long"),
    htmlContent: z.string({ message: "Email template must be a string" }).min(5, "Email template must be at least 5 characters long"),
    jsonContent: z.any(), // Accepts any JSON
    scheduleAt: z
      .string()
      .refine((dateString) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && date.getTime() >= Date.now() + 3 * 60 * 1000;
      }, "Schedule At must be a valid date string and at least 3 minutes in the future"),
  })
  .refine(
    (data) => {
      if (data.repeatable) {
        return !!data.options; // Ensure options is provided when repeatable is true
      }
      return true;
    },
    {
      message: "Options must be provided when repeatable is true",
      path: ["options"],
    }
  );
 
  export const SignInSchema = z.object({
    email: z.string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email"),
    password: z.string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
  })