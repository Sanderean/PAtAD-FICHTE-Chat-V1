import React, { useEffect, useState } from 'react';
import styles from './styles.module.css'
import SideBar from './components/sidebar/sidebar.jsx'
import Body from './components/body/body.jsx'
import MessageBlock from './components/message-block/message-block.jsx'

const ChatPage = ({socket}) => {
    const [messages, setMessages] = useState([])
    const [status, setStatus] = useState('')

    useEffect(() => {
        socket.on('response', (data) => setMessages([...messages, data]))
    }, [socket, messages])

    useEffect(() => {
        socket.on('responseTyping', (data) => {
        setStatus(data)
        setTimeout(() => setStatus(''), 1000)
        })
    }, [socket])

    return (
        <div className={styles.chat}>
            <SideBar socket={socket}/>
            <main className={styles.main}>
                <Body messages={messages} status={status}/>
                <MessageBlock socket={socket}/>
            </main>
        </div>
    );
};

export default ChatPage;