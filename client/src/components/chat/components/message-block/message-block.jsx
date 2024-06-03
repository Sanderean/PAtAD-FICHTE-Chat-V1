import React, {useState} from "react";
import styles from './styles.module.css'

const MessageBlock = ({socket}) => {
    const [message, setMessage] = useState('')

    const isTyping = () => socket.emit('typing', `${localStorage.getItem('user')} is typing...`)

    const handleSend = (e) => {
        e.preventDefault()
        if(message.trim()){
            socket.emit('message', {
                text: message,
                name: localStorage.getItem('user'),
                id: `${socket.id} - ${Math.random}`,
                socketID: socket.id
            })
        }
        setMessage('')
    }
    return (
        <div className={styles.messageBlock} onSubmit={handleSend}>
            <form>
                <input type="text" className={styles.userMessage} value={message} onChange={(e) => setMessage(e.target.value)}
                onKeyDown={isTyping} placeholder="Enter your message"/>
                <button className={styles.btn}>Send</button>
            </form>
        </div>
    );
};

export default MessageBlock;