import React from "react";
import { useRouter } from 'next/router'
import Property from "@/components/ui/property";
export default function Property_id(){
    const propertyId = useRouter().query.id
    return(
    <>
    <h1 className="text-center text-4xl font-black pb-5">Property {`${propertyId}`}</h1>
    <Property propertyId={propertyId}>
        {/* <Rooms propertyId={propertyId}>
            <Items roomId={roomId}/>
        </Rooms> */}
    </Property>
    </>)
}