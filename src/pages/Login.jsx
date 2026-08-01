import {useState} from 'react'
import {supabase} from '../client'
import {useNavigate, Link} from 'react-router'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if(!username.trim() || password.length < 6) {
            setError('Please enter a username and password.')
            return
        }

        setLoading(true)

        const fakeEmail = `${username.trim()}@example.com`

        const {error: loginError} = await supabase.auth.signInWithPassword({
            email: fakeEmail,
            password,

        })

        setLoading(false)

        if(loginError) {
            setError('Invalid username or password.')
        }else{
            navigate('/feed')
        }
    }

    return (
        <div className="auth-page">
            <div className='auth-box'>
                <h2>Log in to ArtFolio</h2>
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

                    <button type='submit' disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
            </div>
        </div>
    )
}

export default Login