import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import DeleteDialog from "./deletedialog";
export default function Properties(props){
    if(props.isLoading) return <div>Getting properties...</div>
    if(!props.properties) return <div>There seems to be no properties...</div>
    if(props.properties.error) return(<div className="text-xl font-semibold text-center p-3 text-red-700">{properties.error}</div>)
    return(
        <div className=" flex flex-col items-center">
            {props.properties.map(property=> 
            <Card key={property.id} className={`my-5 w-1/2`}>
                <CardHeader>
                    <Image href={`${property.image_url}`}></Image>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-2 justify-between">
                    <div id="property_info" className="flex flex-col gap-4">
                        <div className="font-black text-xl">
                           Property {property.id}
                        </div>
                        <div>
                            {property.number}, {property.street}, {property.postcode}
                        </div>
                    </div>
                    <div id="property_actions" className="flex justify-end items-end gap-4">
                        <Button asChild><Link href={`/property/${property.id}`}>View/Edit</Link></Button>
                        <DeleteDialog refresh={props.getProperties} item={property} itemType={`Property`}>
                            <Button variant={`destructive`}>Delete</Button>
                        </DeleteDialog>
                    </div>
                </div>
                </CardContent>
            </Card>
            )}
        </div>
    );
}