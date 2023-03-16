import { NavBar } from "./NavBar"

// Common layout component for all pages
export const Layout = ({children}: {children: any}) => {
  return <>
    <NavBar/>
    {children}
  </>
}