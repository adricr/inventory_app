import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "./button";
import Link from "next/link";
import { Input } from "./input";
import { Label } from "./label";
export default function AddDialog(props){
    const [isItemAdded, setisItemAdded] = useState(false);
    const [errorAdding, seterrorAdding] = useState(false);
    const [addingError, setaddingError] = useState()
    const [textforTitle, setTextforTitle] = useState();
    const [textforDescription, setTextforDescription] = useState()
    const [textforContent, setTextforContent] = useState()
    const [firstSet, setFirstSet] = useState(true)
    function resetStates(){
        setisItemAdded(false)
        seterrorAdding(false)
        setFirstSet(true)
    }
    async function handleSubmit(e){
        e.preventDefault();
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form);
        try {
            const res = await fetch(`http://localhost:5000/api/${props.itemType.toLowerCase()}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (!res.ok) {
                throw new Error(res.status);
            }

            const data = await res.json();
            setTextforTitle(<>{`${props.itemType} added successfully`}</>);
            setTextforDescription(<></>)
            props.itemType.toLowerCase()!=`property` ? 
            setTextforContent(<div className="text-2xl font-semibold">
                {`A ${data.name} has been added!`}
            </div>)
            :
            setTextforContent(<div className="text-2xl font-semibold">
                {`A new property has been added!`}
            </div>)
            setisItemAdded(true);
            setTimeout(props.refresh,2000)
            setTimeout(()=>{setFirstSet(true); setisItemAdded(false)},3000)
        } catch (e) {
            setTextforTitle(<>{`${props.itemType} could not be created`}</>);
            setTextforDescription(<></>)
            setTextforContent(<>{`${props.itemType} was not created, please reload page and try again`}</>);
            seterrorAdding(true);
            setaddingError("Something went wrong: " + e.message);
            if(e.message == 401){
                setTextforDescription(<>{`You are not authorized to create ${props.itemType}`}</>)
                setTextforContent(<>{`${props.itemType} was not created, please reload page or `}<Link className="font-black text-green-600" href={`/login`} >Log in</Link></>);
            }
            console.log(e.message)
        }
    }
    // We Create here the form's inputs and dialog prompts for each type
    // For Properties
    if (props.itemType.toLowerCase() == `property` && firstSet){
        setTextforTitle(<>{`Create a new ${props.itemType}`}</>)
        setTextforDescription(<>{`Create a new ${props.itemType} with this form. Click Save when finished`}</>)
        setTextforContent(<div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="number">Number</Label>
                                        <Input id="number" name="number" defaultValue="13" required/>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="street">Street</Label>
                                        <Input id="street" name="street" defaultValue="Butcher Street" required/>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" defaultValue="Edinburgh" required/>
                                    </div>
                                        <div className="grid gap-3">
                                        <Label htmlFor="postcode">Postcode</Label>
                                        <Input id="postcode" name="postcode" defaultValue="EH12 1LA" required/>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="image_url">Image of the property as URL</Label>
                                        <Input id="image_url" name="image_url" defaultValue="" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="tenant">Tenant's Name</Label>
                                        <Input id="tenant" name="tenant_name" defaultValue="John Smith" required/>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="landlord">Property owner's Name</Label>
                                        <Input id="landlord" name="landlord_name" defaultValue="Jane Doe" required/>
                                    </div>
                                </div>)
        setFirstSet(false)
    }
    // For Rooms
    if (props.itemType.toLowerCase() == "room" && firstSet){
        setTextforTitle(<>{`Create a new ${props.itemType}`}</>)
        setTextforDescription(<>{`Create a new ${props.itemType} with this form. Click Save when finished`}</>)
        setTextforContent(<div className="grid gap-4">
                                <Input type="hidden" id="property_id" name="property_id" value={props.parentId} />
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue="Kitchen" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="descr">Description</Label>
                                <Input id="descr" name="descr" defaultValue="A well lit kitchen in need of painting" required/>
                            </div>
                        </div>)
        setFirstSet(false)
    }
    // For Items
    if (props.itemType.toLowerCase() == "item" && firstSet){
        setTextforTitle(<>{`Create a new ${props.itemType}`}</>)
        setTextforDescription(<>{`Create a new ${props.itemType} with this form. Click Save when finished`}</>)
        setTextforContent(<div className="grid gap-4">
                                <Input type="hidden" id="room_id" name="room_id" value={props.parentId} />
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue="Television" required/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="descr">Description</Label>
                                <Input id="descr" name="description" defaultValue="A 50 inch television in perfect condition" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="descr">Url for image</Label>
                                <Input id="image_url" name="image_url" defaultValue="" />
                            </div>
                        </div>)
        setFirstSet(false)
    }

    return(
            <Dialog>
                <div className="flex justify-center">
                    <DialogTrigger asChild>
                        {props.children}
                    </DialogTrigger>
                </div>
                <DialogContent showCloseButton={false}>
                    <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className={``}>
                            {textforTitle}
                        </DialogTitle>
                        <DialogDescription className={``}>
                            {textforDescription}
                        </DialogDescription>
                    </DialogHeader>
                    {textforContent}
                    <DialogFooter className={`py-2`}>
                        {!errorAdding && (<DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>)}
                        {isItemAdded && (
                        <DialogClose asChild onClick={props.refresh}>
                            <Button >Go back</Button>
                        </DialogClose>
                        )}
                        {!isItemAdded && errorAdding && (                        
                            <DialogClose asChild onClick={resetStates}>
                                <Button variant={`outline`} className={`font-bold`} >I understand!</Button>
                            </DialogClose>) }
                        {!isItemAdded && !errorAdding && <Button  variant="outline" type={`submit`}>Save changes</Button>}
                    </DialogFooter>
                    </form>
                    {/* <div className="grid grid-cols-2 gap-2">
                        <DialogClose asChild>
                            {isItemAdded ? <Button onClick={props.refresh}>Go back</Button> : <Button >Go back</Button>}
                        </DialogClose>
                        {!isItemAdded && !errorAdding && <Button onClick={()=>deleteItem(props.item, props.itemType)} variant={`destructive`}>Delete</Button>}
                    </div> */}
                </DialogContent>
            </Dialog>
        )
}