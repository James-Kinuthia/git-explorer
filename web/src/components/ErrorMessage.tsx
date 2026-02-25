/**
 * 1. Issues faced:
 *     (i) Parsing error: Expression expected
 *     (ii) Expression expected
 *     (iii) Cannot invoke an object which is possibly 'undefined'
 * 
 * 2. Solutions:
 *     (i) changed the message type to string, null or undefined
 *     (iI) changed the className type to optional with the '?'
  */

import React from "react";



interface ErrorMsgTypes{
    message: string | null | undefined;
    className?: string;
}

// We define the return type as: JSX.Element | null
// This means: "I will either return a UI element OR nothing at all."
const ErrorMessage = ({ message, className = '' }: ErrorMsgTypes): React.ReactElement | null => {
    // 1. Guard Clause: If there's no message, return null immediately.
    // This is often cleaner than a ternary for UI components.
    if (!message) {
        return null;
    }

    return (
        <div className={`${className} max-w-2xl mx-auto mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200`}>
            {message}
        </div>
    );
}

export default ErrorMessage;