import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import Items from "./items";
import { Button } from "./button";
 export default function Room(props){
    return (
    <Card>
        <CardHeader className={`grid grid-cols-2`}>
            <CardTitle className={`text-center text-xl`}>{props.name}</CardTitle>
            <CardTitle className={`text-center`}>{props.descr}</CardTitle>
        </CardHeader>
        <CardContent>
            <Items roomId={props.id}></Items>
        </CardContent>
        <CardFooter className={`flex gap-2 justify-center`}>
            <Button>Add Item to {props.name}</Button>
            <Button variant={`destructive`}>Delete {props.name}</Button>
        </CardFooter>
    </Card>

    )
 }