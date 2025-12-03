import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Link from "next/link";
export default function login(){
    const [errorFetching, setErrorFetching] = useState(false)
    const [errorText, setErrorText]= useState(null)
    const router = useRouter()
    function handleSubmit(e){
        e.preventDefault()
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form);
        const password = formData.password
        const email = formData.email
        fetch("http://localhost:5000/login",
        {
        method: "POST",
        credentials: "include",
        headers: {"Content-type": "application/json",},
        body: JSON.stringify(
            {
                "password": password,
                "email": email
            })
        }).then(response => {
            if (!response.ok) {
            throw new Error(response.status);
            }
            router.push(`/`)
        })
        .catch(error => {
            if(error.message == 401){
                setErrorFetching(true)
                setErrorText(`Incorrect Credentials`)
            }
        });
    }
    return(
        <section id="login">
            <Card>
                <CardHeader>
                    <CardTitle className={`text-4xl`}>Login</CardTitle>
                    <CardDescription>Welcome to the ugliest login page I could come up with</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id={`login`} className="grid grid-cols-1 gap-1" onSubmit={handleSubmit}>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type={`email`} name="email" defaultValue="myemail@email.com" required/>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type={`password`} required/>
                         <AlertDialog open={errorFetching}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className={`text-center`}>Log in Failed</AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="text-center text-red-600 font-bold">{errorText}</div>
                                <div className="text-center">Please try again</div>
                                <AlertDialogFooter className={`lg:justify-center`}>
                                    <AlertDialogAction onClick={()=>{setErrorFetching(false); setErrorText(null)}}>Ok!</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                         </AlertDialog>
                        <div className={`flex justify-center mt-2`}>
                            <div className="w-1/2 grid grid-cols-2 gap-3">
                                <Button type={"submit"}>Log in</Button>
                                <Button variant={`secondary`} asChild><Link href={`/register`}>I don't have an Account</Link></Button>
                            </div>
                            
                        </div>
                    </form>
                </CardContent>

            </Card>
        </section>
    )
}