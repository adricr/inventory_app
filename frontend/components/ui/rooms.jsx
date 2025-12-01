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
    function handleSubmit(e){
        e.preventDefault();
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form) 
        console.log(formData)
        try{
            fetch(`http://localhost:5000/api/room`,{
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
            })                                                                                                               
            .then(res =>{
                if (res.ok){
                    getRooms()
                }

            })
            .then(data => console.log(data));
        }
        catch (error){
            console.log(error)
        }
        
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
            {/* <Dialog>
                <div className="flex justify-center">
                    <DialogTrigger asChild>
                        <Button  className={` w-1/2`} size={`lg`}>Add a Room</Button>
                    </DialogTrigger>
                </div>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                Create a new Room
                            </DialogTitle>
                            <DialogDescription>
                                Create a new room with this form. Click Save when finished
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                                <Input type="hidden" id="property_id" name="property_id" value={propertyId} />
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue="Kitchen" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="descr">Description</Label>
                                <Input id="descr" name="descr" defaultValue="A well lit kitchen in need of painting" />
                            </div>
                        </div>
                        <DialogFooter className={`py-2`}>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button  variant="outline" type={`submit`}>Save changes</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog> */}
        </section>
    )
    console.log(rooms.length)
    console.log(rooms)
    return(
        <section className="grid grid-cols-1 gap-4" id="rooms">
            <div className="text-center text-3xl font-semibold pb-2">Rooms</div>
            {rooms.map(room=>{
                console.log(room)
                return <Room room={room} refresh={getRooms} key={room.id}/>
            })}
            <AddDialog itemType={`room`} refresh={getRooms} parentId={propertyId} >
                <Button  className={` w-1/2`} size={`lg`}>Add a Room</Button>
            </AddDialog>
            {/* <Dialog>
                <div className="flex justify-center">
                    <DialogTrigger asChild>
                        <Button  className={` w-1/2`} size={`lg`}>Add a Room</Button>
                    </DialogTrigger>
                </div>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                Create a new Room
                            </DialogTitle>
                            <DialogDescription>
                                Create a new room with this form. Click Save when finished
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                                <Input type="hidden" id="property_id" name="property_id" value={propertyId} />
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue="Kitchen" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="descr">Description</Label>
                                <Input id="descr" name="descr" defaultValue="A well lit kitchen in need of painting" />
                            </div>
                        </div>
                        <DialogFooter className={`py-2`}>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button  variant="outline" type={`submit`}>Save changes</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog> */}
        </section>
    )

}

