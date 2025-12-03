import React from "react";
import { Button } from "@/components/ui/button"
import { Building, ClipboardList, Glasses } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import Link from "next/link";
export default function dashboard(){
    return(
    <>
        <ItemGroup className="grid grid-cols-4 gap-2 w-1/2 place-self-center">
            <Button asChild className="h-full col-span-2">
                <Link href={`/property`}>
                    <Item className="flex flex-col items-center justify-center w-full">
                        <ItemHeader className="flex justify-center items-center h-full w-full">
                        <Building className="w-full text-accent h-full" />
                        </ItemHeader>

                        <ItemContent className="text-center">
                        <ItemTitle className={`font-black  text-4xl`}>Properties</ItemTitle>
                        </ItemContent>
                    </Item>
                </Link>
            </Button>
            <Button asChild className="h-full col-span-2">
                <Link href={`/reports`}>
                    <Item className="flex flex-col items-center justify-center w-full">
                        <ItemHeader className="justify-center">
                        <ClipboardList className="text-accent" />
                        </ItemHeader>

                        <ItemContent className="text-center">
                        <ItemTitle className={`font-black text-4xl`}>Reports</ItemTitle>
                        </ItemContent>
                    </Item>
                </Link>
            </Button>
            <div></div>
            <Button asChild className="h-full col-span-2 col-start-2 w-full">
                <Link href={`/about`}>
                    <Item className="flex flex-col items-center justify-center w-full">
                        <ItemHeader className="justify-center">
                        <Glasses className="text-accent" />
                        </ItemHeader>

                        <ItemContent className="text-center">
                        <ItemTitle className={`font-black text-4xl`}>About</ItemTitle>
                        </ItemContent>
                    </Item>
                </Link>
            </Button>
            <div></div>
        </ItemGroup>
    </>);
}