import { Header } from "./header";

export default function Layout({children}){
    return(
        <>
        <Header/>
        <main className="p-10 flex flex-col justify-center">{children}</main>
        </>
    )
}