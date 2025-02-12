"use client";

import devtoolsDetect from "devtools-detect";
import { useEffect, useState } from "react";

const Message = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-xl font-bold animate-pulse">
            <span className="text-blue-800">Hey You are a developer</span>
            <span>I want to collaborate with you</span>
            <span>Leave a message in Footer with your email Id</span>
        </div>
    )
}

const ConsoleMessage = ({ children }) => {
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(devtoolsDetect.isOpen);

    useEffect(() => {
        const handleChange = (event) => {
            setIsDevToolsOpen(event.detail.isOpen);
        };

        window.addEventListener("devtoolschange", handleChange);

        return () => {
            window.removeEventListener("devtoolschange", handleChange);
        };
    }, []);

    return <>{isDevToolsOpen ? <Message /> : <>{children}</>}</>;
};

export default ConsoleMessage;
