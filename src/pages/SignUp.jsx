import {useState} from 'react'
import {useNavigate, Link} from 'react-router'
import {supabase} from '../client'

function SignUp() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if(!username.trim() || password.length < 6) {
            setError('Username and password are required. Password must be at least 6 characters long.')
            return
        }

        setLoading(true)
        
        const {data: existingUser} = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .maybeSingle()
        
        if (existingUser) {
            setError('Sorry, username has already been chosen.')
            setLoading(false)
            return
        }

        const fakeEmail = `${username.trim()}@example.com`

        const {data, error: signupError} = await supabase.auth.signUp({
            email: fakeEmail,
            password,
            options: { data: {username: username.trim()}},
        })

        if(signupError) {
            setError(signupError.message)
            setLoading(false)
            return
        }

        const {error: profileError} = await supabase
            .from('profiles')
            .insert({id: data.user.id, username: username.trim()})

        setLoading(false)

        if(profileError) {
            setError('Account created, but failed to create profile, Please try logging in.')
        }else{
            navigate('/feed')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-box">
                <h2>Create your ArtFolio account</h2>
                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Password</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <p>Already have an account? <Link to='/login'>Log in</Link></p>
            </div>
        </div>
    )

}

export default SignUp