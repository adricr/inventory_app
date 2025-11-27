import React, { useState, useEffect } from "react";
import Room from "./room";
import { Button } from "./button";
export default function Rooms({propertyId}){
    const [rooms, setRooms] = useState()
    const [isLoading,setIsLoading]=useState(true)
    const [isError, setIsError] = useState(false)
    console.log(propertyId)
    useEffect(() => {
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
    }, [])

    if(isLoading) return <div>Loading Rooms...</div>
    if(isError && !isLoading) return <div>{rooms}</div>
    if(rooms.message) return (
        <div className="flex flex-col items-center gap-2">
            <div className="text-center text-xl font-semibold">{rooms.message}</div>
            <Button className={`w-1/2`} size={`lg`}>Add a Room</Button>
        </div>
    )
    console.log(rooms.length)
    console.log(rooms)
    return(
        <section>
            <div className="text-center text-3xl font-semibold pb-2">Rooms</div>
            {rooms.map(room=>{
                console.log(room)
                return <Room key={room.id} id={room.id} descr={room.descr} name={room.name} property_id={room.property_id}  />
            })}
        </section>
    )

}

