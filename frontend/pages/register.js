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
export default function register(){
    const [successFetching, setSuccessFetching] = useState(false)
    const [errorFetching, setErrorFetching] = useState(false)
    const [errorText, setErrorText]= useState(null)
    const router = useRouter()
    function handleSubmit(e){
        e.preventDefault()
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form);
        const password = formData.password
        const email = formData.email
        const username = formData.username
        console.log(formData)
        fetch("http://localhost:5000/register",
        {
        method: "POST",
        headers: {"Content-type": "application/json",},
        body: JSON.stringify(
            {
                "username": username,
                "password": password,
                "email": email
            })
        }).then(response => {
            if (!response.ok) {
                console.log(response.status)
            throw new Error(response.status);
            }
            setSuccessFetching(true)
        })
        .catch(error => {
            if(error.message == 409){
                setErrorFetching(true)
                setErrorText(`The email you chose is already in use`)
            }else{
                setErrorFetching(true)
                setErrorText(`Something went wrong`)
            }
        });
    }
    return(
        <section id="about">
            <Card>
                <CardHeader>
                    <CardTitle className={`text-4xl`}>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="grid grid-cols-1 gap-1" onSubmit={handleSubmit}>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" defaultValue="my_username" required/>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type={`email`} name="email" defaultValue="myemail@email.com" required/>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type={`password`} required/>
                        <Button type={`submit`}>Register</Button>
                         <AlertDialog open={errorFetching}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className={`text-center`}>Registering Failed</AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="text-center text-red-600 font-bold">{errorText}</div>
                                <div className="text-center">Please try again</div>
                                <AlertDialogFooter className={`lg:justify-center`}>
                                    <AlertDialogAction onClick={()=>{setErrorFetching(false); setErrorText(null)}}>Ok!</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                         </AlertDialog>
                         <AlertDialog open={successFetching}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className={`text-center`}>Success Registering!</AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="text-center text-green-600 font-bold">You have registered Succesfully</div>
                                <AlertDialogFooter className={`lg:justify-center`}>
                                    <AlertDialogAction onClick={()=>{setSuccessFetching(false), router.push(`/login`)}}>Log in!</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                         </AlertDialog>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}