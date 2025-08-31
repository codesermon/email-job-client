import { apiUrl } from "@/config";

export const getNewsletterGroups = async() => {
    try {
        console.log(apiUrl)
        const result = await fetch(`${apiUrl}/api/subscribe/groups`, 
            { 
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },

            })
        return await result.json();
    } catch (error: any) {
        throw error
    }
}