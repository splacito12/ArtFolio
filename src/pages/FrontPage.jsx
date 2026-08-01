import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { useUser } from '../User'
import Sidebar from '../components/Sidebar'
import countryRoad from '../assets/countryRoad.jpg'

function FrontPage() {
    const {username, setUsername} = useUser()
    const [input, setInput] = useState(username || '');
    const [sideBar, setSidebar] = useState(false)
    const navigate = useNavigate()


    return (
        <div className="Front-Page">
            <header className="front-header">
                <h1 className="title">ArtFolio</h1>
                <button
                    className="sidebar-btn"
                    onClick={() => setSidebar(true)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            <Sidebar isOpen={sideBar} onClose={() => setSidebar(false)} />
            
            <div className="front-main">
                <div className="front-text">
                    <h2>Welcome to ArtFoolio! A website where you can share your art with other artists!</h2>

                    <div className="username-form">
                        <div className='user-btn'>
                            <Link to='/signup' className='create-post-btn'>Sign Up</Link>
                            <Link to='/login' className='create-post-btn'>Log In</Link>
                        </div>
                    </div>
                </div>

                <div className="front-img">
                    <img src={countryRoad} alt="art" />
                </div>
            </div>
        </div>
    )
}

export default FrontPage