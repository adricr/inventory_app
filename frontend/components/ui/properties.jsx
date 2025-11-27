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
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";

// var properties = [{
//   "city": "London",
//   "id": 1,
//   "image_url": "https://example.com/house.jpg",
//   "landlord_name": "Mrs. Smith",
//   "number": 12,
//   "postcode": "NW1 6XE",
//   "street": "Baker Street",
//   "tenant_name": "John Doe"
// },{
//   "city": "Edinburgh",
//   "id": 2,
//   "image_url": "https://example.com/house.jpg",
//   "landlord_name": "Mrs. Smith",
//   "number": 13,
//   "postcode": "EH15 1LA",
//   "street": "Butcher Street",
//   "tenant_name": "John Doe"
// }]

export default function Properties(){
    const [properties, setProperties]= useState(null);
    const[isLoading, setLoading] = useState(true);
    useEffect(()=>{
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
    },[])

    if(isLoading) return <div>Getting properties...</div>
    if(!properties) return <div>There seems to be no properties...</div>
    if(properties.error) return(<div className="text-xl font-semibold text-center p-3 text-red-700">{properties.error}</div>)
    return(
        <div className=" flex flex-col items-center">
            {properties.map(property=> 
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
                        <Button variant={`destructive`}>Delete</Button>
                    </div>
                </div>
                </CardContent>
            </Card>
            )}
        </div>
    );
}