import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link";
import HeaderLogoDesktop from "./header-logo-desktop";

function Header(){
    return(<header className="grid grid-cols-3 items-center w-full">
            <div></div>
            <HeaderLogoDesktop className={"px-4"}/>
            <div className="w-full flex justify-end px-4">
            <NavigationMenu >
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/dashboard">Dashboard</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/property">Properties</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()} >
                        <Link href="/reports">Reports</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/about">About</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            </NavigationMenu>
            </div>
        </header>
    );
}
export {Header}