import { NavBar } from '@/components/NavBar'
import {useState} from 'react'; 

export default function Home() {

  const [route, setRoute] = useState('/home'); 

  return (
    <>
      <NavBar route={route} setRoute={setRoute}/>
    </>
  )
}
