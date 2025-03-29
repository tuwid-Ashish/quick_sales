import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link,useNavigate } from "react-router"
import { useForm,SubmitHandler } from "react-hook-form";
import { Logindata } from "@/types"
import { getCurrentUser, loginUser } from "@/api"
import { useDispatch } from "react-redux";
import { login } from "@/Store/AuthSlice";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"


export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<Logindata>({defaultValues: {
    username: "",
    password: "",    
  },});

  const onSubmit: SubmitHandler<Logindata> = data =>{
      console.log(data);
     try {
      loginUser(data).then((res) => {
        console.log(res);
        dispatch(login(res.data.data));
        navigate("/");
        getCurrentUser()
        .then((res) => {
          console.log("what we get response",res);
        }).catch((err) => {
            console.log(`error while fetching user ${err}`);
        })
      })
      .catch((err) => {
        console.log("the error on server side ", err);
        toast("something went wrong");
      });
     } catch (error) {
       console.log(error)
       toast("something went wrong");
     }
  };
  return (
    <div className={cn("flex max-w-sm flex-col gap-6", className)} {...props}>
      <Toaster />
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
      
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">username</Label>
                    <Input
                    id="username"
                    placeholder="username"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                      value: 4,
                      message: "Username must be at least 3 characters"
                      },
                      maxLength: {
                      value: 20,
                      message: "Username must be less than 20 characters"
                      },
                      pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Username can only contain letters, numbers and underscores"
                      }
                    })}
                    />
                    {errors.username && (
                    <p style={{ color: "orangered" }}>{errors.username.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      onClick={() => {
                        navigate("/forgot-password");
                      }}
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                  id="password"
                  type="password"
                  placeholder="password"
                   {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    },
                    // pattern: {
                    //   value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    //   message: "Password must contain at least one letter and one number"
                    // }
                   })}/>
                  {errors.password && (
                  <p style={{ color: "orangered" }}>{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="flex flex-col gap-4"> 
                <Button variant="outline" type="button" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to={'/signup'} className="underline underline-offset-4">Sign up</Link> 
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
