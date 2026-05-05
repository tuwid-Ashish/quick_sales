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
        
        // Protected routes: if authentication is required and user is not authenticated, send to login
        if (authentication && !Authstatus) {
            navigate("/login");
        }

        // Public routes (authentication === false) should NOT auto-redirect to `/`.
        // This allows visiting `/login` or other public pages even if auth state is pending.
        setLoader(false);
    }, [Authstatus, navigate, authentication])
    return loader?<h1>Loading...</h1>:<>
    {children}
    </>
}

export default Protected