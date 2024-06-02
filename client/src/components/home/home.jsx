import { useNavigate } from "react-router-dom";
import React, {useState} from "react";
import styles from './styles.module.css'

const Home = ({socket}) => {
    const navigate = useNavigate()
    const [user, setUser] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('user', user)
        navigate('/chat')
        socket.emit('newUser', {user, socketID: socket.id})
    }

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <h2>Enter the chat</h2>
            <label htmlFor="user"></label>
            <input type="text" id="user" value={user} onChange={(e) => setUser(e.target.value)} className={styles.userInput}/>
            <button type="submit" className={styles.homeBtn}>Enter</button>
        </form>
    );
};

export default Home;