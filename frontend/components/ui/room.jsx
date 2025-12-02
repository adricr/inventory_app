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
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "./button";
import DeleteDialog from "./deletedialog";
import AddDialog from "./add-dialog";
 export default function Room(props){
    console.log(props.room)
    const [items, setitems] = useState()
    const [isLoading,setIsLoading]=useState(true)
    const [isError, setIsError] = useState(false)
    function getItems(){
        fetch(`http://localhost:5000/api/room/${props.room.id}/item`)
                .then(response => {
                    if (!response.ok) {
                    throw new Error(`status: ${response.status}`);
                    }
                    if (response.status == 204){
                    return null
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
    }
    useEffect(() => {
        getItems()
    }, [])
    console.log(` hi ${items}`)
    return (
    <Card>
        <CardHeader className={`grid grid-cols-2`}>
            <CardTitle className={`text-center text-xl`}>{props.room.name}</CardTitle>
            <CardTitle className={`text-center`}>{props.room.descr}</CardTitle>
        </CardHeader>
        <CardContent>
            {isError && <div> {`Oh no something went wrong fetching your items ${items}`}</div>}
            {isLoading && <div>Loading items...</div> }
            {!isError && !items && <div className="text-center text-xl font-semibold">{`This room has no items!`}</div> }
            {items && !isError && !isLoading && items.map(item=>{
                        return(
                                <Card className= {`my-3`}key={item.id}>
                                    <CardHeader className={`text-center font-semibold`}>
                                    {item.name}
                                    </CardHeader>
                                    <CardContent className={`grid grid-cols-3 items-center`}>
                                        <Image href="" width={200} height={150}></Image>
                                        <div className="text-center">{item.description}</div>
                                        <DeleteDialog itemType={`item`} refresh={getItems} item={item}>
                                            <Button className={`self-end w-1/2 rounded-full`} variant={`destructive`}>Delete {item.name}</Button>
                                        </DeleteDialog>
                                    </CardContent>
                                </Card>
                        )
                    })}
        </CardContent>
        <CardFooter className={`flex gap-2 justify-center`}>
            <AddDialog itemType={`item`} refresh={getItems} parentId={props.room.id}>
                <Button onClick={props.refresh}>Add Item to {props.room.name}</Button>
            </AddDialog>
            <DeleteDialog itemType={`room`} refresh={props.refresh} item={props.room}>
                <Button variant={`destructive`}>Delete {props.room.name}</Button>
            </DeleteDialog>
        </CardFooter>
    </Card>

    )
 }