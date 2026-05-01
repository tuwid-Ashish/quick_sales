import { Sprout } from "lucide-react";
import { LoginForm } from "@/components/ui/login_form";
import { Link } from "react-router";

export default function LoginPage() {
  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-gray-100 font-nunito p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-green-200 rounded-full opacity-50 animate-blob"></div>
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-amber-200 rounded-full opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-24 h-24 bg-pink-200 rounded-full opacity-50 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex flex-col items-center gap-4 mb-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-amber-400 p-2.5 rounded-full group-hover:scale-110 transition-transform shadow-md">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-extrabold text-gray-800 tracking-tight">
                Get Gardening
              </span>
            </Link>
            <p className="text-gray-500 text-center">
              Welcome back, little gardener! Let's see how your plants are doing.
            </p>
          </div>
          <LoginForm />
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-green-600 hover:underline">
              Sign up here!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
