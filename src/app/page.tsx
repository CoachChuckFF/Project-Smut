"use client";

import { useEffect, useState } from "react";
import { NostrProfile, getNostrProfile, getStories } from "../components/controllers/nostr";
import { DEFAULT_PREFERENCES_DARK, ReaderPreferences } from "@/components/models/reader";
import { Story, TEST_STORIES } from "@/components/models/story";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";

export default function Home() {

  // ----------- STATE ------------------
  const [stories, setStories] = useState<Story[]>([])
  const [nostr, setNostr] = useState<any>(null);
  const [profile, setProfile] = useState<NostrProfile | null>(null);
  const [readerPreferences, setReaderPreferences] = useState<ReaderPreferences>(
    DEFAULT_PREFERENCES_DARK
  );

  const router = useRouter();

  // ----------- EFFECTS ------------------
  useEffect(() => {
    if ((window as any).nostr) {
      setNostr((window as any).nostr);
    }

    getStories().then(setStories)
  }, []);

  useEffect(() => {
    if (nostr) {
      getNostrProfile(nostr)
        .then(setProfile)
        .catch(() => {
          setProfile(null);
        });
      console.log("Hi");
      getStories();
    }
  }, [nostr]);

  // ----------- FUNCTIONS ------------------

  const onLogin = () => {
    alert("Please use alby");
  };
  const onProfile = () => {};

  const onAuthor = (authorID: string) => {};
  const onTitle = (storyID: string) => {router.push(`/read/${storyID}`);};
  const onTag = (tag: string) => {};
  const onStory = (storyID: string) => {router.push(`/read/${storyID}`);};
  const onCreateStory = () => {
    router.push("/write");
  };


  // ----------- HTML ------------------
  return (
    <main
      className="flex flex-col items-center justify-between p-3 md:pr-24 md:pl-24"
      style={readerPreferences}
    >
      <nav className="flex justify-between w-full mb-14 p-3 h-[10vh]">
        <p className="text-4xl font-bold">Erotica Stories</p>
        {profile ? (
          <div className="w-12 h-12 overflow-hidden rounded-full">
            {" "}
            {/* This is the square container */}
            <img
              src={profile.picture}
              alt="User's Profile Picture"
              className="w-full h-full object-cover"
              onClick={onProfile}
            />
          </div>
        ) : (
          <button onClick={onLogin} className="text-white px-4 py-2 rounded">
            Sign In
          </button>
        )}
      </nav>
      <div className="flex flex-col gap-8 max-w-5xl w-full overflow-y-auto space-y-8">
        {stories.map((story, idx) => (
          <div key={idx} className="rounded-lg">
            <div className="flex items-start mb-4">
              <img
                onClick={() => {
                  onAuthor(story.authorID);
                }}
                src="https://via.placeholder.com/50"
                alt="Author Icon"
                width={50}
                height={50}
                className="rounded-full mr-4 cursor-pointer"
              />
              <div>
                <h2
                  onClick={() => {
                    onTitle(story.storyID);
                  }}
                  className="font-bold cursor-pointer hover:underline"
                >
                  {story.title}
                </h2>
                <ul className="flex space-x-2 mt-1">
                  {story.tags.map((tag, tagIdx) => (
                    <li
                      onClick={() => {
                        onTag(tag);
                      }}
                      key={tagIdx}
                      className="text-stone-500 underline cursor-pointer hover:text-stone-600"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              onClick={() => {
                onStory(story.storyID);
              }}
              className="mt-4 cursor-pointer"
            >
              <MDEditor.Markdown source={story.summary} style={{ whiteSpace: 'pre-wrap', backgroundColor: 'rgba(0, 0, 0, 0.0)' }} />
              {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {story.story}
              </ReactMarkdown> */}
              <div className="flex justify-end mt-4 items-center space-x-3">
                {/* Word count */}
                <span>{story.story.split(" ").length} words</span>
                {/* Zaps */}
                <span>
                  <strong>{5000}</strong> ⚡︎
                </span>
                {/* Zaps to buy */}
                <span>{5000}⚡︎🛍️</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Floating Action Button */}
      <button
        onClick={onCreateStory}
        className="fixed bottom-10 right-10 bg-stone-500 hover:bg-stone-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        aria-label="Create New Post"
      >
        +
      </button>
    </main>
  );
}
