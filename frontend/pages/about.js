import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Turret_Road } from 'next/font/google';
    const turret_road = Turret_Road(
    {
        subsets: ['latin'],
        weight: ['800'],
    });
export default function about(){
    return(
        <section id="about">
            <Card>
                <CardHeader>
                    <CardTitle className={`text-4xl`}>What is <span className={`font-bold ${turret_road.className}`} >Inventory App</span>  about?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <span className={` ${turret_road.className}`} >Inventory App</span> is an inventory management system built to help property managers save time on tedious tasks 
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}