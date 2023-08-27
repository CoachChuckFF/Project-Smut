import { getStoryByID } from "@/components/controllers/nostr";
import { Metadata } from "next";
import ReadPageContent from "./ReadPageContent";


interface Props {
    params: {
        id: string
    }
}

export async function generateMetadata(props: Props): Promise<Metadata>{
    const id = props.params.id;

    try {
        const story = await getStoryByID(id);

        if(!story) throw new Error('No Story Found')

        return {
            title: story.title,
            description: story.summary,
        }
    } catch(e){
        return {
            title: "Story Not Found",
        }
    }
}

export default async function ReadPage(props: Props) {
    const id = props.params.id;

    const story = await getStoryByID(id);

    if(!story){
        return <>
            Story Not Found
        </>
    }

    return (
      <>
        <ReadPageContent story={story} />        
      </>
    );
  }
  