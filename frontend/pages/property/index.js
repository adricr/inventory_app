import React, { useState, useEffect } from "react";
import Properties from "@/components/ui/properties";
import { Button } from "@/components/ui/button";
import { Dialog,DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AddDialog from "@/components/ui/add-dialog";
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
     console.log(properties)
    return(
        <section className="grid grid-col-1 gap-2">
            <h1 className="text-center text-4xl font-black">Properties</h1>
            {properties!=null && properties.length!=0 ? <Properties getProperties={getProperties} isLoading={isLoading} properties={properties}/> : <div className="font-bold text-center">No properties</div>}
            <AddDialog itemType={`Property`} refresh={getProperties}>
              <Button className={`w-1/3`}>Add a Property</Button>  
            </AddDialog>
        </section>
    )
}

