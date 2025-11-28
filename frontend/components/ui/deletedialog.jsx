import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./button";
export default function DeleteDialog(props){
    const [isItemDeleted, setIsItemDeleted] = useState(false);
    const [errorDeleting, setErrorDeleting] = useState(false);
    const [deletingError, setDeletingError] = useState()
    const [textforTitle, setTextforTitle] = useState(<>{`Attention! this will delete the ${props.itemType}`}</>);
    const [textforDescription, setTextforDescription] = useState(<>{`Are you sure you want to`} <span className="text-red-600 font-bold">delete</span> {props.itemType} {props.item.id}</>)
    async function deleteItem(item, itemTyp){
        try {
        const res = await fetch(`http://localhost:5000/api/${itemTyp.toLowerCase()}/${item.id}`, {
        method: "DELETE"
        });

        if (!res.ok) {
        throw new Error(res.status);
        }

        // Success
        setIsItemDeleted(true);
        setErrorDeleting(false);
        setTextforTitle(<>{`Deleted successfully!`}</>);
        setTextforDescription(
        <>
            {`${itemTyp.charAt(0).toUpperCase() + itemTyp.slice(1)} ${
            item.id
            } deleted successfully`}
        </>
        );
        setTimeout(()=>{
            props.refresh()
        },2000);
        
        
        
        } catch (error) {
            console.log(`oh no`)
            setErrorDeleting(true);
            setDeletingError(error.message);
            setTextforTitle(<>{`Error deleting ${itemTyp} `}</>);
            if(error.message == 405){
                setTextforDescription(<>{`The ${itemTyp.toLowerCase()} contains elements, please delete them first`}</>);
            }
        }
    }
    
    // Item needs deleting
    return(
        <Dialog>
            <DialogTrigger asChild>
                {props.children}
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className={`text-center text-red-600 font-semibold`}>
                        {textforTitle}
                    </DialogTitle>
                    <DialogDescription className={`text-center text-foreground`}>
                        {textforDescription}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2">
                    <DialogClose asChild>
                        {isItemDeleted ? <Button onClick={props.refresh}>Go back</Button> : <Button >Go back</Button>}
                    </DialogClose>
                    {!isItemDeleted && !errorDeleting && <Button onClick={()=>deleteItem(props.item, props.itemType)} variant={`destructive`}>Delete</Button>}
                </div>
            </DialogContent>
        </Dialog>
    )
    
}