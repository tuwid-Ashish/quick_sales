import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { login } from "@/Store/AuthSlice";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { registerUser } from "@/api";
import { Link, useNavigate } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { Signdata } from "@/types";
import { Sprout } from "lucide-react";

export default function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Signdata>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<Signdata> = (data) => {
    console.log(data);
    try {
      registerUser(data)
        .then((res) => {
          console.log(res);
          dispatch(login(res.data.data));
          toast.success("Welcome! Your garden adventure begins!");
          navigate("/");
        })
        .catch((err) => {
          console.log("the error on server side ", err);
          toast.error("Uh oh! Something went wrong. Please try again.");
        });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-gray-100 font-nunito p-4">
      <Toaster richColors />
      <div className="relative w-full max-w-md">
        <div className="absolute -top-20 -right-10 w-40 h-40 bg-green-200 rounded-full opacity-50 animate-blob"></div>
        <div className="absolute -bottom-10 -left-16 w-40 h-40 bg-amber-200 rounded-full opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-28 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-50 animate-blob animation-delay-4000"></div>

        <div
          className={cn(
            "relative z-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200",
            className
          )}
          {...props}
        >
          <Card className="bg-transparent border-0">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center gap-4 mb-4">
                <Link to="/" className="flex items-center gap-2.5 group">
                  <div className="bg-amber-400 p-2.5 rounded-full group-hover:scale-110 transition-transform shadow-md">
                    <Sprout className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-3xl font-extrabold text-gray-800 tracking-tight">
                    Get Gardening
                  </span>
                </Link>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Join the Fun!
              </CardTitle>
              <CardDescription className="text-gray-500">
                Create an account to start your gardening adventure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="parent@example.com"
                      {...register("email", {
                        required: "An email is needed to join!",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Oops! That doesn't look like a valid email.",
                        },
                      })}
                      className="rounded-full"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs px-3">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="e.g., SuperSprout"
                      {...register("username", {
                        required: "Pick a fun username!",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters.",
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9_]+$/,
                          message: "Only letters, numbers, and underscores, please!",
                        },
                      })}
                      className="rounded-full"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs px-3">{errors.username.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="A secret password"
                      {...register("password", {
                        required: "A secret password is required!",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters long.",
                        },
                      })}
                      className="rounded-full"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs px-3">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Type it one more time"
                      {...register("confirmPassword", {
                        required: "Please confirm your secret password.",
                        validate: (value) =>
                          value === watch("password") || "Passwords don't match!",
                      })}
                      className="rounded-full"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs px-3">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded-full py-3 mt-4 text-base">
                    Let's Grow!
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-green-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
        <div className="text-balance text-center text-xs text-gray-500 mt-4 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          By clicking "Let's Grow!", you agree to our{" "}
          <a href="#">Terms of Fun</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
