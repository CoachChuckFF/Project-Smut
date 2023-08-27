'use client';

import { getStories, postStory } from "@/components/controllers/nostr";
import { useState } from "react";
import MDEditor from '@uiw/react-md-editor';

export default function WritePage() {
    const [markdownContent, setMarkdownContent] = useState("");
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");

    const handleSubmit = async () => {
        console.log("Submitted title:", title);
        console.log("Submitted content:", markdownContent);

        // Your logic to post the story
        await postStory( title, markdownContent, (window as any).nostr);

        // Maybe reset the fields
        setTitle("");
        setMarkdownContent("");
    }

    return (
        <div>
            {/* Title Input */}
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                className="mb-2 p-2 w-full  bg-stone-800"
            />

            <MDEditor
                value={markdownContent}
                onChange={value => setMarkdownContent(value ?? '')}
            />

            {/* Floating Action Button */}
            <button
                onClick={handleSubmit}
                className="fixed bottom-10 right-10 bg-stone-500 hover:bg-stone-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                aria-label="Create New Post"
            >
                ✔️
            </button>
        </div>
    );
}

