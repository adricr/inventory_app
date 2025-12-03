import React, { useState, useEffect } from "react";
import Room from "./room";
import { Button } from "./button";
import { Dialog,DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,DialogClose, DialogFooter } from "./dialog";
import { Label } from "./label";
import { Input } from "./input";
import AddDialog from "./add-dialog";
export default function Rooms({propertyId}){
    const [rooms, setRooms] = useState()
    const [isLoading,setIsLoading]=useState(true)
    const [isError, setIsError] = useState(false)
    function getRooms(){
        fetch(`http://localhost:5000/api/property/${propertyId}/room`)
                .then(response => {
                    if (!response.ok) {
                    throw new Error(`status: ${response.status}`);
                    }
                    if (response.status == 204){
                    return {"message": "No rooms found"}
                    }
                    return response.json()
                    })
                    .then(data => {
                        setRooms(data)
                        setIsLoading(false)
                    })
                    .catch(error => {
                        setIsLoading(false)
                        setIsError(true)
                        setRooms({error: `There's an issue with the backend!`})
                    });
    }
    
    useEffect(() => {
        getRooms();
    }, [])

    if(isLoading) return <div>Loading Rooms...</div>
    if(isError && !isLoading) return <div>{rooms}</div>
    if(rooms.message) return (
        <section className="grid grid-cols-1 gap-4" id="rooms">
            <div className="text-center text-xl font-semibold">{rooms.message}</div>
            <AddDialog itemType={`room`} refresh={getRooms} parentId={propertyId} >
                <Button  className={` w-1/2`} size={`lg`}>Add a Room</Button>
            </AddDialog>
        </section>
    )
    return(
        <section className="grid grid-cols-1 gap-4" id="rooms">
            <div className="text-center text-3xl font-semibold pb-2">Rooms</div>
            {rooms.map(room=>{
                return <Room room={room} refresh={getRooms} key={room.id}/>
            })}
            <AddDialog itemType={`room`} refresh={getRooms} parentId={propertyId} >
                <Button  className={` w-1/2`} size={`lg`}>Add a Room</Button>
            </AddDialog>
        </section>
    )

}

