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
    console.log(props.room)
    return (
    <Card>
        <CardHeader className={`grid grid-cols-2`}>
            <CardTitle className={`text-center text-xl`}>{props.room.name}</CardTitle>
            <CardTitle className={`text-center`}>{props.room.descr}</CardTitle>
        </CardHeader>
        <CardContent>
            <Items roomId={props.room.id}></Items>
        </CardContent>
        <CardFooter className={`flex gap-2 justify-center`}>
            <Button onClick={props.refresh}>Add Item to {props.room.name}</Button>
            <Button variant={`destructive`}>Delete {props.room.name}</Button>
        </CardFooter>
    </Card>

    )
 }