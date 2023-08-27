'use client';

import { Story } from "@/components/models/story";
import MDEditor from "@uiw/react-md-editor";

export interface ReadPageContentProps {
    story: Story,
}

export default function ReadPageContent(props: ReadPageContentProps){
    const { story } = props;


    return (
        <MDEditor.Markdown source={story.story} style={{ whiteSpace: 'pre-wrap', backgroundColor: 'rgba(0, 0, 0, 0.0)' }} />
    )
}