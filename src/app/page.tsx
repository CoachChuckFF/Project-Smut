'use client';

import { useState } from 'react';
import { TEST_STORIES } from './models/story' // Adjust the import path to where you defined TEST_STORIES
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { DEFAULT_PREFERENCES_DARK, ReaderPreferences } from './models/reader';

export default function Home() {
  const [readerPreferences, setReaderPreferences] = useState<ReaderPreferences>(DEFAULT_PREFERENCES_DARK);

  const onAuthor = (authorID: string) => {}
  const onTitle = (storyID: string) => {}
  const onTag = (tag: string) => {}
  const onStory = (storyID: string) => {}

  return (
    <main className="flex flex-col items-center justify-between p-3 md:pr-24 md:pl-24" style={readerPreferences}>
      <p className="text-4xl font-bold mb-14">Erotica Stories</p>
      <div className="flex flex-col gap-8 max-w-5xl w-full overflow-y-auto space-y-8">
        {TEST_STORIES.map((story, idx) => (
          <div key={idx} className="rounded-lg">
            <div className="flex items-start mb-4">
              <img onClick={()=>{onAuthor(story.authorID)}} src="https://via.placeholder.com/50" alt="Author Icon" width={50} height={50} className="rounded-full mr-4 cursor-pointer" />
              <div>
                <h2 onClick={()=>{onTitle(story.storyID)}} className="font-bold cursor-pointer hover:underline">{story.title}</h2>
                <ul className="flex space-x-2 mt-1">
                  {story.tags.map((tag, tagIdx) => (
                    <li onClick={()=>{onTag(tag)}} key={tagIdx} className="text-stone-500 underline cursor-pointer hover:text-stone-600">{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div onClick={() => {onStory(story.storyID)}} className='mt-4 cursor-pointer'>
              <ReactMarkdown children={story.story} remarkPlugins={[remarkGfm]} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
