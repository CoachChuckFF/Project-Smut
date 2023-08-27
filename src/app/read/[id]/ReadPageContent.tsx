"use client";

import {
  getInvoiceFromProfile,
  getNostrProfileFromKey,
} from "@/components/controllers/nostr";
import { NostrProfile } from "@/components/models/nostrProfile";
import {
  DEFAULT_PREFERENCES_DARK,
  DEFAULT_PREFERENCES_LIGHT,
  ReaderPreferences,
} from "@/components/models/reader";
import { Story } from "@/components/models/story";
import MDEditor from "@uiw/react-md-editor";
import { error } from "console";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQRCode } from "next-qrcode";
import { WebLNProvider, requestProvider } from "webln";
import Modal from "@/components/views/Modal";

export interface ReadPageContentProps {
  story: Story;
}

export default function ReadPageContent(props: ReadPageContentProps) {
  // ------------ STATE -----------
  const { story } = props;
  const [webln, setWebln] = useState<null | WebLNProvider>(null);
  const [paymentQR, setPaymentQR] = useState<string | null>(null);
  const [readerPreferences, setReaderPreferences] = useState<ReaderPreferences>(
    DEFAULT_PREFERENCES_DARK
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const { Canvas } = useQRCode();
  const router = useRouter();

  // ------------ EFFECTS -----------
  useEffect(() => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setReaderPreferences(isDarkMode ? DEFAULT_PREFERENCES_DARK : DEFAULT_PREFERENCES_LIGHT);
  }, []);
  
  useEffect(() => {
    requestProvider()
      .then(setWebln)
      .catch((e) => {
        console.log("No LN Provider");
      });
  }, []);

  useEffect(() => {
    if (story.authorProfile) {
      getInvoiceFromProfile(story.authorProfile)
        .then((pay) => {
          setPaymentQR(`lightning:${pay}`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  // ------------ FUNCTIONS -----------

  const onZap = () => {
    if (paymentQR && !showModal) {
      setShowModal(true);

      if (webln) {
        webln.sendPayment(paymentQR);
      }
    }
  };
  const onExit = () => {
    setShowModal(false);
  };
  const onBack = () => {
    router.replace("/");
  };

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

      <div className="flex flex-col gap-8 max-w-5xl w-full overflow-y-auto space-y-8 mb-60">
        <div className="rounded-lg">
          <div className="flex items-start">
            <img
              src={
                story.authorProfile
                  ? story.authorProfile.picture
                  : "https://via.placeholder.com/50"
              }
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
      {paymentQR ? (
        <button
          onClick={onZap}
          className="fixed bottom-10 right-10 bg-stone-700 hover:bg-stone-800 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Zap Post"
        >
          ⚡︎
        </button>
      ) : null}

        <button
          onClick={onBack}
          className="fixed bottom-10 right-10 bg-stone-700 hover:bg-stone-800 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Back"
        >
          ←
        </button>

      <Modal isOpen={showModal}>
        <div className="flex flex-col gap-4 items-center justify-center">
          <p className="font-semibold mx-auto flex-wrap w-72 text-center">
            Zap Author 5 Sats
          </p>
          <a href={paymentQR ?? ""} target="blank">
          <Canvas
            text={paymentQR ?? "_"}
            options={{
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 4,
              width: 200,
              color: {
                dark: "#00000000",
                light: "#FFFFFFFF",
              },
            }}
          />
          </a>
          <a href={paymentQR ?? ""} target="blank">Tap To Pay</a>
          <button className="py-2 px-6 text-white" onClick={onExit}>
            Close
          </button>
        </div>
      </Modal>
    </main>
  );
}
