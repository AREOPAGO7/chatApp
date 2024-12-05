import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const ChatApp = () => {
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io("http://localhost:4000");
        setSocket(newSocket);

        newSocket.on("message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => newSocket.disconnect();
    }, []);

    const handleConnect = () => {
        if (username.trim()) {
            socket.emit("set_username", username);
            setIsConnected(true);
        } else {
            alert("Please enter a username.");
        }
    };

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("chat_message", { username, message });
            setMessage("");
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            {!isConnected ? (
                <div className="p-8 bg-white rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Welcome to ChatApp</h2>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        onClick={handleConnect}
                    >
                        Connect
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-lg bg-white rounded shadow-md flex flex-col">
                    <h2 className="text-xl font-semibold bg-blue-500 text-white p-4 rounded-t">
                        Welcome, {username}!
                    </h2>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {messages.map((msg, index) => (
                            <p key={index} className="text-gray-800">
                                <strong className="font-medium text-blue-500">{msg.username}:</strong> {msg.message}
                            </p>
                        ))}
                    </div>
                    <div className="p-4 border-t flex items-center space-x-2">
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatApp;
