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
    async function handleSubmit(e){
        e.preventDefault();
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form);
        if (props.itemType.toLowerCase() == "room"){
            try {
                const res = await fetch("http://localhost:5000/api/room", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                if (!res.ok) {
                    setTextforTitle(<>{`Room could not be created`}</>);
                    setTextforContent(<>{`Room was not created, please try again`}</>);
                    seterrorAdding(true);
                    throw new Error(`Response status: ${res.status}`);
                }

                const data = await res.json();

                setTextforTitle(<>{`Room added successfully`}</>);
                setTextforDescription(<></>)
                setTextforContent(<div className="text-2xl font-semibold">
                    {`There's now a ${data.name} in the property!`}
                </div>);
                setisItemAdded(true);
                setTimeout(props.refresh,2000)
                setTimeout(()=>{setFirstSet(true); setisItemAdded(false)},3000)
            } catch (e) {
                setaddingError("Something went wrong: " + e.message);
            }
        }
    }

    if (props.itemType.toLowerCase() == "room" && firstSet){
        setTextforTitle(<>{`Create a new ${props.itemType}`}</>)
        setTextforDescription(<>{`Create a new ${props.itemType} with this form. Click Save when finished`}</>)
        setTextforContent(<div className="grid gap-4">
                                <Input type="hidden" id="property_id" name="property_id" value={props.parentId} />
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue="Kitchen" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="descr">Description</Label>
                                <Input id="descr" name="descr" defaultValue="A well lit kitchen in need of painting" />
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
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        {isItemAdded && (
                        <DialogClose asChild onClick={props.refresh}>
                            <Button >Go back</Button>
                        </DialogClose>
                        )}

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