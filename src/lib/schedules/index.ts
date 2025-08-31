import { apiUrl } from "@/config";
import { SchedulePayload } from "@/types";

export const scheduleEmailJob = async(args: SchedulePayload) => {
    try {
        console.log(apiUrl)
        const result = await fetch(`${apiUrl}/api/schedules`, 
            { 
                body: JSON.stringify(args), 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

            })
        return await result.json();
    } catch (error: any) {
        console.log(error)
        throw error
    }
}