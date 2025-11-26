import React from "react";
import { useRouter } from 'next/router'

export default function Property(){
    const propertyId = useRouter().query.id
    return(<div>property {`${propertyId}`}</div>)
}