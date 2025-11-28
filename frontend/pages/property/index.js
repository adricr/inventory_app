import React, { useState, useEffect } from "react";
import Properties from "@/components/ui/properties";
import { Button } from "@/components/ui/button";
import { Dialog,DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
export default function property(){
    const [properties, setProperties]= useState(null);
    const [isLoading, setLoading] = useState(true);
    function getProperties(){
        fetch("http://localhost:5000/api/property")
            .then(response => {
                if (!response.ok) {
                throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                setProperties(data)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                setProperties({error: `There's an issue with the backend!`})
                console.error("Fetch error:", error);
            });   
    }
    
    useEffect(()=>{
        getProperties();
    },[])

    function handleSubmit(e){
        e.preventDefault();
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form)
        try{
            fetch(`http://localhost:5000/api/property/new_property`,{
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
            })                                                                                                               
            .then(res =>{
                if (res.ok){
                    getProperties()
                }

            })
            .then(data => console.log(data));
        }
        catch (error){
            console.log(error)
        }
    }
    return(
        <section className="grid grid-col-1">
            <h1 className="text-center text-4xl font-black">Properties</h1>
            <Properties getProperties={getProperties} isLoading={isLoading} properties={properties}/>
            <Dialog >
                    <div className="flex justify-center">
                    <DialogTrigger asChild >
                        <Button className={`w-1/3`}>Add a Property</Button>
                    </DialogTrigger>
                    </div>
                    <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                Create a new Property
                            </DialogTitle>
                            <DialogDescription>
                                Create a new property with this form. Click Save when finished
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="number">Number</Label>
                                <Input id="number" name="number" defaultValue="13" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="street">Street</Label>
                                <Input id="street" name="street" defaultValue="Butcher Street" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" defaultValue="Edinburgh" />
                            </div>
                                <div className="grid gap-3">
                                <Label htmlFor="postcode">Postcode</Label>
                                <Input id="postcode" name="postcode" defaultValue="EH12 1LA" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="image_url">Image of the property as URL</Label>
                                <Input id="image_url" name="image_url" defaultValue="" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tenant">Tenant's Name</Label>
                                <Input id="tenant" name="tenant_name" defaultValue="John Smith" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="landlord">Property owner's Name</Label>
                                <Input id="landlord" name="landlord_name" defaultValue="Jane Doe" />
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
            </Dialog>
        </section>
    )
}

