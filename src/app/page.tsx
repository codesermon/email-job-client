import { auth } from "@/auth";
import { Homepage } from "@/components/pages";
import { apiUrl } from "@/config";
import { NewsletterGroup } from "@/types";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()
  console.log("session ", session)
  if(!session) return redirect("/auth")
  const result = await fetch(`${apiUrl}/api/subscribe/groups`, {
    method: "GET",
    next: { revalidate: 0 },
    headers: {
      "Content-Type": "application/json",
    },
  });
  const groups = (!result.ok ? [] : await result.json()) as NewsletterGroup[];
  return <Homepage groups={groups} />;
}
