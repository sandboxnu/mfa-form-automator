import { NavBar } from "./NavBar"

export const Layout = ({children}: {children: any}) => {
  return <>
    <NavBar/>
    {children}
  </>
}