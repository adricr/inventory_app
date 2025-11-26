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
export default function Property(props){
    console.log(props.propertyId)
    if (props.propertyId){
    const [property, setProperty]= useState(null);
    const[isPropertyLoading, setPropertyLoading] = useState(true);
    useEffect(()=>{
        fetch(`http://localhost:5000/api/property/${props.propertyId}`)
            .then(response => {
                if (!response.ok) {
                return response.json()
                }
                return response.json();
            })
            .then(data => {
                setProperty(data)
                console.log(property)
                setPropertyLoading(false)
            })
            .catch(error => {
                console.error("Fetch error:", error);
            });
    },[])
    if (isPropertyLoading) return <div>Property loading...</div>
    if (!property) return <div>This property does not exist...</div>
    if(property.error) return <div className="text-xl text-center p-3">{`${property.error}`}</div>
    console.log(property)
    if(property.image_url){
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
                    <div className="text-4xl text-center font-semibold">Rooms</div>
                    <Rooms propertyId={props.propertyId}></Rooms>
                </CardContent>
            </Card>
        )
    }

    }
    
    
}