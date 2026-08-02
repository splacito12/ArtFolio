import { Link, useNavigate } from "react-router"
import {useUser} from '../User'

function Sidebar({isOpen, onClose}) {
    const {session, logout} = useUser()
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        onClose()
        navigate('/')
    }

    function handleLoginClick() {
        onClose()
        navigate('/login')
    }

    return (
        <>
        {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="sidebar-close" onClick={onClose}>x</button>
            <nav>
                <Link to="/feed" onClick={onClose}>Feed</Link>
                <Link to="/create" onClick={onClose}>Create Post</Link>
                <Link to="/account" onClick={onClose}>Account</Link>
                
                {session ? (
                    <button className='logout-btn' onClick={handleLogout}>Log Out</button>
                ) : (
                    <button className='logout-btn' onClick={handleLoginClick}>Log In</button>
                )}
            </nav>
        </div>

        </>
    )
}

export default Sidebar
