import { useNavigate } from "react-router"
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/Store/Store'
interface AuthLayoutProps {
    children: React.ReactNode;
    authentication?: boolean;
}

const Protected: React.FC<AuthLayoutProps> = ({ children, authentication = true }) => {
    const [loader, setLoader] = useState(true)
    const navigate = useNavigate()
    const Authstatus = useAppSelector(state => state.Auth.status)
    // const Authstatus = true

    useEffect(() => {
        console.log("Authstatus", Authstatus);
        
        if (authentication && Authstatus !== authentication) {
            navigate("/Login")
        }
        else if (!authentication && Authstatus !== authentication) {
            navigate("/")
        } setLoader(false)
    }, [Authstatus, navigate, authentication])
    return loader?<h1>Loading...</h1>:<>
    {children}
    </>
}

export default Protected