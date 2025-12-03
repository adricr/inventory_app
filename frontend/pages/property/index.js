import React, { useState, useEffect } from "react";
import Properties from "@/components/ui/properties";
import { Button } from "@/components/ui/button";
import { Dialog,DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AddDialog from "@/components/ui/add-dialog";
import Link from "next/link";
export default function property(){
    const [properties, setProperties]= useState(null);
    const [isLoading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState(null)
    function getProperties(){
        fetch("http://localhost:5000/api/property", {
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                throw new Error(response.status);
                }
                return response.json();
            })
            .then(data => {
                setProperties(data)
                setLoading(false)
            })
            .catch(error => {
                if(error.message == 401){
                    setLoading(false)
                    setProperties(null)
                    setErrorText(<>You are not Authorized to see this content, please <Link className="font-bold text-2xl text-green-400" href={`/login`}>log in</Link></>)
                }else{
                    setLoading(false)
                    setProperties(null)
                    setErrorText(<>Something went wrong</>)
                }
                })
       
    }
    
    useEffect(()=>{
        getProperties();
    },[])
    return(
        <section className="grid grid-col-1 gap-2">
            <h1 className="text-center text-4xl font-black">Properties</h1>
            {properties!=null && properties.length!=0 ? (
                <>
                    <Properties getProperties={getProperties} isLoading={isLoading} properties={properties}/>
                    <AddDialog itemType={`Property`} refresh={getProperties}>
                        <Button className={`w-1/3`}>Add a Property</Button>  
                    </AddDialog>
                </>) : 
                (
                    <div className="font-bold text-center">{errorText}</div>
                )}
        </section>
    )
}

