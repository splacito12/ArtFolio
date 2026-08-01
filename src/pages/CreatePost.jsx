import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { supabase } from "../client"
import { useUser } from "../User"
import Sidebar from "../components/Sidebar"
import { TAGS} from "../components/Tags"


function CreatePost() {
    const { id } = useParams();
    const isEditMode = Boolean(id)
    const { username } = useUser()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(isEditMode)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('');
    const [sidebar, setSidebar] = useState(false)
    const [selectedTags, setSelectedTags] = useState([])

    useEffect(() => {
        if(isEditMode) {
            fetchPost();
        }
    }, [id])

    async function fetchPost() {
        const {data, error} = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single()

        if(error) {
            console.error(error)
            setError('Could not load post.')
        }else{
            if(data.username !== username) {
                navigate(`/post/${id}`)
                return
            }

            setTitle(data.title)
            setBody(data.body || '')
            setImageUrl(data.image_url || '')
            setSelectedTags(data.tags || [])
        }

        setLoading(false)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if(!title.trim()){
            setError('Title is required')
            return
        }
        setSaving(true)
        setError('')

        if(isEditMode) {
            const {error} = await supabase
                .from('posts')
                .update({
                    title: title.trim(),
                    body: body.trim(),
                    image_url: imageUrl.trim(),
                    tags: selectedTags,
                })
                .eq('id', id)

            setSaving(false)
            if(error) {
                console.error(error)
                setError('Sorry...the post failed to update.')
            }else{
                navigate(`/post/${id}`)
            }
        }else{
            const {data, error } = await supabase
                .from('posts')
                .insert({
                    username,
                    title: title.trim(),
                    body: body.trim(),
                    image_url: imageUrl.trim(),
                    tags: selectedTags,
                })
                .select()
                .single()

            setSaving(false)
            if(error) {
                console.error(error)
                setError('Failed to create post.')
            }else{
                navigate(`/post/${data.id}`)
            }
        }
    }

    function toggleTag(tag) {
        setSelectedTags((prevTags) => {
            if(prevTags.includes(tag)) {
                return prevTags.filter((t) => t !== tag)
            } else {
                return [...prevTags, tag]
            }
        })
    }

    if(loading) {
        return <p>Loading...</p>
    }

    return (
        <div className="create-post-page">
            <header className="feed-header">
                <h1 className="title">ArtFolio</h1>
                <button className="sidebar-btn" onClick={() => setSidebar(true)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            <Sidebar isOpen={sidebar} onClose={() => setSidebar(false)} />

            <div className="create-post-main">
                <h2>{isEditMode ? 'Edit Post' : 'Create a New Post'}</h2>

                {error && <p className="form-error">{error}</p>}

                <form onSubmit={handleSubmit} className="create-post-form">
                    <label htmlFor="post-title">Title *</label>
                    <input 
                        id="post-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your post a title!"
                    />

                    <label htmlFor="post-body">Description</label>
                    <textarea
                        id="post-body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Tell us about your piece..."
                        rows={6} 
                    />

                    <label htmlFor="post-image">Image URL</label>
                    <input 
                        id="post-image"
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/your-art.jpg"
                    />

                    {imageUrl && (
                        <div className="image-preview">
                            <img 
                                src={imageUrl}
                                alt="Preview"
                                onError={(e) => (e.target.style.display = 'none')}
                                onLoad={(e) => (e.target.style.display = 'block')}
                            />
                        </div>
                    )}

                    <label>Tags</label>
                    <div className='tag-selection'>
                        {TAGS.map((tag) => (
                            <label key={tag} className='tag-checkbox'>
                                <input 
                                    type='checkbox'
                                    checked={selectedTags.includes(tag)}
                                    onChange={() => toggleTag(tag)}
                                />
                                {tag}
                            </label>
                        ))}
                    </div>

                    <button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Post'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreatePost