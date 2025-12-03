import React from "react";
import { useState,useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import Rooms from "./rooms";
import DeleteDialog from "./deletedialog";
export default function Property(props){
    if (props.propertyId){
    const [property, setProperty]= useState(null);
    const[isPropertyLoading, setPropertyLoading] = useState(true);
    function getProperty(){
        fetch(`http://localhost:5000/api/property/${props.propertyId}`,
            {
                credentials:"include"
            }
        )
            .then(response => {
                if (!response.ok) {
                return response.json()
                }
                return response.json();
            })
            .then(data => {
                setProperty(data)
                setPropertyLoading(false)
            })
            .catch(error => {
                if(error.message = 401){
                    setPropertyLoading(false)
                    setProperty({error: <><div>{`You are unauthorized to see this content`}</div><Link href={`/login`}>Log in</Link></>})
                }else{
                    setPropertyLoading(false)
                    setProperty({error: <>{`There's an issue with the backend!`}</>})
                }
            });
    }
    useEffect(()=>{
        getProperty()
    },[])
    if (isPropertyLoading) return <div>Property loading...</div>
    if (!property) return <div>This property does not exist...</div>
    if(property.error) return (<>
    <div className="text-xl font-semibold text-center p-3 text-red-700">{`${property.error}`}</div>
    <Link className="text-center text-5xl font-black text-green-500" href={`/property`}>See Properties</Link>
    </>
    )
        return (
            <Card>
                <CardHeader className={`grid grid-cols-2 items-center`}>
                    <Image width={500} height={250} href={`${property.image_url}`}></Image>
                    <div id="property_info" className="flex flex-col gap-2 items-center">
                        <div className="text-3xl font-extrabold">{property.number}, {property.street}</div>
                        <div className="font-semibold">{property.postcode}</div>
                        <div className="font-semibold">{property.city}</div>
                        <div className="grid grid-cols-2">
                            <div>Tenant:</div>
                            <div className="font-extrabold">{property.tenant_name}</div>
                            <div>Landlord:</div>
                            <div className="font-extrabold">{property.landlord_name}</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent >
                    <Rooms propertyId={props.propertyId}></Rooms>
                </CardContent>
                <CardFooter className={`flex justify-end`}>
                    <DeleteDialog  refresh={getProperty} item={property} itemType={`Property`}>
                        <Button variant={`destructive`}>Delete Property</Button>
                    </DeleteDialog>
                </CardFooter>
            </Card>
        )
    

    }
    
    
}