import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | PE Realtors Backoffice",
  description: "Sign in to PE Realtors Backoffice Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
