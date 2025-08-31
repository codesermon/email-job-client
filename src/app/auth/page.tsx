import PageClient from "./PageClient"
import { signIn } from "@/auth"

export default function Page() {
    // Server Action
  async function signInAction(formData: FormData) {
    'use server'
    // Mutate data
    await signIn("credentials", formData)
  }
 
  return (<PageClient signInAction={signInAction} />)
}