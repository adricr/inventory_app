import React from "react";
import Properties from "@/components/ui/properties";
import { Button } from "@/components/ui/button";
export default function property(){
    return(
        <section className="grid grid-col-1">
            <h1 className="text-center text-4xl font-black">Properties</h1>
            <Properties/>
            <div className="flex justify-center">
                <Button className={`w-1/3`}>Add a Property</Button>
            </div>
        </section>
    )
}