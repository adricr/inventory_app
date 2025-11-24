import Image from "next/image";
import * as React from "react";
import { Turret_Road } from 'next/font/google';
import Link from "next/link";
const turret_road = Turret_Road(
    {
        subsets: ['latin'],
        weight: ['800'],
    });

export default function HeaderLogoDesktop(props)
{
    var url_source = ""
    if (url_source)
        return(
            <Image
                className={props.className}
                src={url_source}
                width={500}
                height={100}
                alt="Picture of the author"
            />
        );
    else 
        return(
            <Link href={`/`}>            
                <div className={`${props.className} ${turret_road.className} text-5xl py-4 text-center text-orange-300`}>
                    Inventory App
                </div>
            </Link>

    );
}