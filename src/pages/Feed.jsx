import { useEffect, useState } from "react"
import { Link } from "react-router"
import { supabase } from '../client'
import Sidebar from "../components/Sidebar"
import { TAGS } from "../components/Tags"


function Feed() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('created_at')
    const [search, setSearch] = useState('')
    const [sidebar, setSidebar] = useState(false)
    const [tagFilter, setTagFilter] = useState('')

    useEffect(() => {
        fetchPosts()
    }, [sortBy])

    async function fetchPosts() {
        setLoading(true)
        const {data, error} = await supabase
            .from('posts')
            .select('*')
            .order(sortBy, {ascending: false})

        if(error) {
            console.error('Error fetching posts:', error)
        }else {
            setPosts(data)
        }

        setLoading(false)
    }

    const filtered = posts.filter((post) =>{
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase())
        const matchesTag = !tagFilter || (post.tags && post.tags.includes(tagFilter))
        return matchesSearch && matchesTag
    })

    return (
        <div className="feed-page">
            <header className="feed-header">
                <h1 className="title">ArtFolio</h1>
                <button className="sidebar-btn" onClick={() => setSidebar(true)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            <Sidebar isOpen={sidebar} onClose={() => setSidebar(false)} />

            <div className="feed-main">
                <div className="feed-controls">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="feed-search"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="feed-sort"
                    >
                        <option value="created_at">Newest</option>
                        <option value="upvotes">Most Upvoted</option>
                    </select>
                    <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="feed-tag-filter">
                        <option value=''>All Tags</option>
                        {TAGS.map((tag) => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}

                    </select>
                    <Link to="/create" className="create-post-btn">
                        + Create Post
                    </Link>
                </div>

                {loading ? (
                    <p>Loading posts...</p>
                ) : filtered.length === 0 ? (
                    <p>No posts found.</p>
                ) : (
                    <div className="post-list">
                        {filtered.map((post) => (
                            <Link to={`/post/${post.id}`} key={post.id} className="post-card">
                                <h3>{post.title}</h3>
                                <p className="post-meta">
                                    by {post.username} · {new Date(post.created_at).toLocaleString()} · {post.upvotes} upvotes
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Feed