import { createContext, useContext, useState, useEffect } from "react"
import {supabase} from "./client"

const userContext = createContext();

function User({children}) {
    const [session, setSession] = useState(null)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then((({data: {session}}) => {
            setSession(session)
            setUsername(session?.user?.user_metadata?.username || '')
            setLoading(false)
        }))

        const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUsername(session?.user?.user_metadata?.username || '')
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    async function logout() {
        await supabase.auth.signOut()
    }

    return (
        <userContext.Provider value={{ username, session, loading, logout}}>
            {children}
        </userContext.Provider>
    )
}

export const useUser = () => useContext(userContext)

export default User