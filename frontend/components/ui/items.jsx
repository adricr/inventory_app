import React from "react";
import { useState, useEffect } from "react";
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
import { Button } from "./button";
export default function Items({roomId}){
    const [items, setitems] = useState()
    const [isLoading,setIsLoading]=useState(true)
    const [isError, setIsError] = useState(false)
    useEffect(() => {
        fetch(`http://localhost:5000/api/room/${roomId}/item`)
                .then(response => {
                    if (!response.ok) {
                    throw new Error(`status: ${response.status}`);
                    }
                    if (response.status == 204){
                    return {"message": "No items found"}
                    }
                    return response.json()
                    })
                    .then(data => {
                        setitems(data)
                        setIsLoading(false)
                    })
                    .catch(error => {
                        setIsLoading(false)
                        setIsError(true)
                        setitems({error: `There's an issue with the backend!`})
                    });
    }, [])

    if(isLoading) return <div>Loading items...</div>
    if(isError && !isLoading) return <div>{items}</div>
    if(items.message) return <div>{items.message}</div>
    return(
        items.map(item=>{
            return(
                    <Card className= {`my-3`}key={item.id}>
                        <CardHeader className={`text-center font-semibold`}>
                        {item.name}
                        </CardHeader>
                        <CardContent className={`grid grid-cols-3 items-center`}>
                            <Image href="" width={200} height={150}></Image>
                            <div className="text-center">{item.description}</div>
                            <Button className={`self-end w-1/2 rounded-full`} variant={`destructive`}>Delete {item.name}</Button>
                        </CardContent>
                    </Card>
            )
        })

    )
}