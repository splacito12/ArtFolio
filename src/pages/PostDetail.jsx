import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { supabase } from '../client'
import { useUser } from '../User'
import Sidebar from '../components/Sidebar'

function PostDetail() {
    const { id} = useParams()
    const navigate = useNavigate()
    const { username, session } = useUser()

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [commentTxt, setCommentTxt] = useState('')
    const [postComment, setPostComment] = useState(false)
    const [sidebar, setSidebar] = useState(false)

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [id])

    async function fetchPost() {
        const {data, error} = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single()

        if(error) {
            console.error(error)
        }else {
            setPost(data)
        }

        setLoading(false)
    }

    async function fetchComments() {
        const {data, error} = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', id)
            .order('created_at', {ascending: true})

        if(error) {
            console.error(error)
        }else {
            setComments(data)
        }
    }

    async function handleUpvote() {
        const {data, error} = await supabase
            .from('posts')
            .update({upvotes: post.upvotes + 1})
            .eq('id', id)
            .select()
            .single()

        if(error) {
            console.error(error)
        }else {
            setPost(data)
        }
    }

    async function handleCommSubmit(e) {
        e.preventDefault()
        if( !commentTxt.trim()) {
            return
        }

        setPostComment(true);
        const {error} = await supabase
            .from('comments')
            .insert({
                post_id: id,
                username: username,
                comment: commentTxt.trim()
            })

        setPostComment(false)
        if(error){
            console.log(error)
        }else{
            setCommentTxt('')
            fetchComments()
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm('Are you sure you want to delete this post?')
        if(!confirmed) {
            return
        }

        const {error} = await supabase
            .from('posts')
            .delete()
            .eq('id', id)

        if(error) {
            console.error(error)
        }else{
            navigate('/feed')
        }
    }

    if(loading) {
        return <p> Loading...</p>
    }

    if(!post) {
        return <p> Post not found. </p>
    }

    const isOwner = post.username === username


    return (
        <div className="posts-detail-page">
            <header className="feed-header">
                 <h1 className="title">ArtFolio</h1>
                <button className="sidebar-btn" onClick={() => setSidebar(true)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            <Sidebar isOpen={sidebar} onClose={() => setSidebar(false)} />

            <div className="post-detail-main">
                <Link to="/feed" className="back-link">← Back to Feed</Link>

                <div className="post-detail-content">
                    <h2>{post.title}</h2>
                    <p className="post-meta">
                        by {post.username} ·  {new Date(post.created_at).toLocaleString()}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                        <div className = 'post-tags'>
                            {post.tags.map((tag) => (
                                <span key={tag} className='tag-badge'>{tag}</span>
                            ))}
                        </div>
                    )}

                    {post.image_url && (
                        <img 
                            src={post.image_url}
                            alt={post.title}
                            className="post-detail-img"
                            onError={(e) => (e.target.style.display = 'none')}
                        />
                    )}

                    {post.body && <p className="post-body">{post.body}</p>}

                    <div className="post-actions">
                        <button className="upvote-btn" onClick={handleUpvote}>
                            ▲ {post.upvotes} Upvotes
                        </button>

                        {isOwner && (
                            <>
                                <Link to={`/post/${id}/edit`} className="edit-btn">
                                    Edit
                                </Link>
                                <button className="delete-btn" onClick={handleDelete}>
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="comments-section">
                    <h3>Comments ({comments.length})</h3>

                    <form onSubmit={handleCommSubmit} className="comment-form">
                        <textarea
                            placeholder="Leave a comment..."
                            value={commentTxt}
                            onChange={(e) => setCommentTxt(e.target.value)}
                            rows={3}
                        />
                        <button type="submit" disabled={postComment}>
                            {postComment ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>

                    <div className="comment-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">There are no comments yet. Be the first :D!</p>
                        ) : (
                            comments.map((c) => (
                                <div key={c.id} className="comment">
                                    <p className="comment-username">{c.username}</p>
                                    <p className="comment-text">{c.comment}</p>
                                    <p className="comment-time">
                                        {new Date(c.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PostDetail