// import React, { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// function VerifyEmail() {
//   const [eror, seterror] = useState();
//   const [mailedtoken, setToken] = useState(null);
//   const [Resend, setResend] = useState();
//   const { handleSubmit, register } = useForm();
//   const dispatch = useDispatch();
//   const userdata = useSelector((state) => state.Auth.user);
//   const navigate = useNavigate();
//   const verifyToken = ({ token }) => {
//     console.log("my token is", token.length);

//     // if (token !== mailedtoken) {
//     //   console.log("token not matched");
//     //   seterror("ENTER THE CORRECT TOKEN");
//     // }
//     if (token.length < 6) {
//       seterror("token must be of 6 digit");
//     }
//     if (!userdata.password) {
//       navigate("/reset-password");
//     }
//     axios
//       .post(`${import.meta.env.VITE_SERVER_URI}/users/signup`, userdata)
//       .then((res) => {
//         dispatch(logout());
//         console.log(res);
//         dispatch(login(res.data));
//         navigate("/");
//       })
//       .catch((err) => {
//         console.log(`error occured on signup time ${err}`);
//         console.log(userdata);
//       });
//   };
//   const sendmail = async () => {
//     axios
//       .post(`${import.meta.env.VITE_SERVER_URI}/users/emailverify`, {
//         email: userdata.email,
//         Emailtype: userdata.password ? "verifyEmail" : "forgotPassword",
//       })
//       .then((res) => {
//         setToken(res.data);
//       })
//       .catch((err) => {
//         console.log(`error occured on sending email ${err}`);
//       });
//   };
//   useEffect(() => {
//     console.log(userdata);
//     setTimeout(sendmail, 2000);
//   }, []);

//   return (
//     <div className="flex flex-col justify-center items-center">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-3xl">Enter Token</CardTitle>
//           <CardDescription className="text-lg">
//             Enter verification code sent to your email
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form
//             onSubmit={handleSubmit(verifyToken)}
//             className="flex w-full flex-col  justify-around items-center"
//           >
//             <Input
//               maxLength={6}
//               placeholder="enter the token "
//               {...register("token", { required: true })}
//             />
//             {eror ? <div className="text-red-400">{eror}</div> : null}
//             <CountDown
//               daysInHours={true}
//               zeroPadTime={1}
//               zeroPadDays={0}
//               date={Date.now() + 58999}
//             >
//               <a
//                 className="font-semibold underline float-end cursor-pointer"
//                 onClick={sendmail}
//               >
//                 Resend code
//               </a>
//             </CountDown>
//             <Button type="submit" className="w-full">Verify</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default VerifyEmail;