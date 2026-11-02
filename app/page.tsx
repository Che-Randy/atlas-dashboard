import { redirect } from "next/navigation";

// There's nothing at "/" yet, so send visitors straight to the dashboard.
export default function Home() {
  redirect("/atlas");
}
