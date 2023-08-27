"use client";

import { getInvoiceFromProfile, getNostrProfileFromKey } from "@/components/controllers/nostr";
import { NostrProfile } from "@/components/models/nostrProfile";
import {
  DEFAULT_PREFERENCES_DARK,
  ReaderPreferences,
} from "@/components/models/reader";
import { Story } from "@/components/models/story";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface ReadPageContentProps {
  story: Story;
}

export default function ReadPageContent(props: ReadPageContentProps) {

 // ------------ STATE -----------
  const { story } = props;
  const [readerPreferences, setReaderPreferences] = useState<ReaderPreferences>(
    DEFAULT_PREFERENCES_DARK
  );
  const router = useRouter();

 // ------------ EFFECTS -----------

 useEffect(()=>{
    if(story.authorProfile){
        getInvoiceFromProfile(story.authorProfile)
    }
 }, [])

 // ------------ FUNCTIONS -----------

  const onZap = () => {};
  const onBack = () => {
    router.replace('/')
  }

 // ------------ HTML -----------
  return (
    <main
      className="flex flex-col items-center justify-between p-3 md:pr-24 md:pl-24"
      style={readerPreferences}
    >
      <nav className="flex justify-between w-full mb-14 p-3 h-[10vh]">
        <button onClick={onBack} className="text-white px-4 py-2 rounded">
            Back
          </button>
      </nav>

      <div className="flex flex-col gap-8 max-w-5xl w-full overflow-y-auto space-y-8">
        <div className="rounded-lg">
          <div className="flex items-start mb-4">
            <img
              src={story.authorProfile ? story.authorProfile.picture : "https://via.placeholder.com/50"}
              alt="Author Icon"
              width={50}
              height={50}
              className="rounded-full mr-4 cursor-pointer"
            />
            <div>
              <h2 className="font-bold cursor-pointer hover:underline">
                {story.title}
              </h2>
              <p>By: {story.authorProfile?.name ?? story.authorID}</p>
              <p>Pay: {story.authorProfile?.lud16 ?? 'XXX'}</p>
              <ul className="flex space-x-2 mt-1">
                {story.tags.map((tag, tagIdx) => (
                  <li
                    key={tagIdx}
                    className="text-stone-500 underline cursor-pointer hover:text-stone-600"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 mb-10">
            <MDEditor.Markdown source={story.story} style={readerPreferences} />
          </div>
        </div>
      </div>
      {/* Floating Action Button */}
      <button
        onClick={onZap}
        className="fixed bottom-10 right-10 bg-stone-500 hover:bg-stone-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        aria-label="Create New Post"
      >
        ⚡︎
      </button>
    </main>
  );
}
