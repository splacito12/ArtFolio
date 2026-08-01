import {useEffect, useState} from 'react'
import {Link} from 'react-router'
import {supabase} from '../client'
import Sidebar from '../components/Sidebar'
import {useUser} from '../User'

function Account() {
    const {username} = useUser()
    const [post, setPost] = useState([])
    const [loading, setLoading] = useState(true)
    const [sidebar, setSidebar] = useState(false)

    useEffect (() => {
        if(username) {
            fetchUserPosts()
        }
    }, [username])


    async function fetchUserPosts() {
        setLoading(true)
        const {data, error} = await supabase
            .from('posts')
            .select('*')
            .eq('username', username)
            .order('created_at', {ascending: false})

        if(error) {
            console.log(error)
        }else{
            setPost(data)
        }

        setLoading(false)
    }


    return (
        <div className= 'account-page'>
            <header className='feed-header'>
                <h1 className='title'> ArtFolio</h1>
                <button
                    className="sidebar-btn"
                    onClick={() => setSidebar(true)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            <Sidebar isOpen={sidebar} onClose={() => setSidebar(false)} />

            <div className='feed-main'>
                <h2 className='account-heading'> {username}'s Account </h2>
                
                <h3 className='post-heading'>Your Posts</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : post.length === 0 ? (
                    <p>You haven't made a post yet.</p>
                ) : (
                    <div className='post-list'>
                        {post.map((post) => (
                            <Link to={`/post/${post.id}`} key={post.id} className='post-card'>
                                <h3>{post.title}</h3>
                                <p className='post-meta'>
                                    {new Date(post.created_at).toLocaleString()} · {post.upvotes} upvotes
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Account