import { useState, useEffect } from "react";


import axios from "axios";


import EmptyChat from "./components/EmptyChat";
import FileProcessing from "./components/FileProcessing";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DocumentHeader from "./components/DocumentHeader";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import { getUrl,get_answer,saveChats,uploadfile } from "./services/services";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const [recentChats, setChats] = useState([]);

  const [pdf, setPdf] = useState(null);

  const [messages, setMessages] = useState([]);

  const [isFileProcessing, setFileProcessing] = useState(false);

  const [pdfUrl, setURL] = useState("");

  const [loading, setLoading] = useState(false);

  const [currChat, setCurrChat] = useState(null);

  // Theme state
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/chats"
        );

        setChats(response.data.chats);
      } catch (error) {
        console.error(error);
        setChats([]);
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    if (recentChats.length === 0) return;

         saveChats(recentChats);


  }, [recentChats]);

  useEffect(() => {
    if (currChat == null) return;

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === currChat) {
          return {
            ...chat,
            messages: messages,
          };
        }

        return chat;
      })
    );
  }, [messages, currChat]);

  const getpdfUrl = async (document_id) => {
    

    try {
      
        const url = await getUrl(document_id)
      setURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async (file) => {
   

    try {
     return await uploadfile(file)
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = async (e) => {
    try {
      setFileProcessing(true);

      const selectedfile = e.target.files[0];

      setSelectedFile(selectedfile);

      const url = URL.createObjectURL(selectedfile);
      setURL(url);

      const pdfInfo = await uploadFile(selectedfile);

      const id = Date.now();

      setChats((prev) => [
        ...prev,
        {
          id: id,
          title: selectedfile.name,
          pdfInfo: pdfInfo,
          messages: [],
        },
      ]);

      setCurrChat(id);
      setMessages([]);
      setPdf(pdfInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setFileProcessing(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !pdf?.document_id) return;

    const userQuery = text.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuery,
      },
    ]);

    try {
      setLoading(true);

      const response = await get_answer(userQuery,pdf.document_id)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.answer,
        },
      ]);
    } catch (e) {
      console.error("Failed to send message:", e);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrChat(null);
    setMessages([]);
    setPdf(null);
    setSelectedFile(null);
  }

  const handleSelectChat = (chat) => {
    setCurrChat(chat.id);
    setPdf(chat.pdfInfo);
    setMessages(chat.messages);
    getpdfUrl(chat.pdfInfo.document_id);
  }

  return (
    <div
      className={
        theme === "dark"
          ? "dark min-h-screen"
          : "min-h-screen"
      }
    >
      <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#0b0d10] dark:text-zinc-100">

      <Navbar theme={theme} setTheme={setTheme} />

        {/* Sidebar */}
       <Sidebar recentChats={recentChats} currChat={currChat} onNewChat={handleNewChat} onSelectChat={handleSelectChat} />

        {/* Main */}
        <main className="ml-65 h-screen overflow-hidden bg-zinc-50 pt-16 transition-colors duration-200 dark:bg-[#0b0d10]">

          <div className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-4xl flex-col overflow-y-auto px-6 scrollbar-none [&::-webkit-scrollbar]:hidden">

            {/* Empty chat */}
            {messages.length === 0 &&
              selectedFile == null &&
              pdf == null && (
                <EmptyChat
                  handleFileChange={handleFileChange}
                />
              )}

            {/* File processing */}
            {messages.length === 0 &&
              isFileProcessing && (
                <FileProcessing
                  name={selectedFile.name}
                />
              )}

            {pdf && !isFileProcessing && (
              <section className="flex-1 pb-44 pt-10">

                {/* Document header */}
             <DocumentHeader pdf={pdf} pdfUrl={pdfUrl} />

                {/* Messages */}
              <MessageList loading={loading} messages={messages} />
              </section>
            )}
          </div>

          {/* Input area */}
          <div className="fixed bottom-0 left-65 right-0 z-30 bg-gradient-to-t from-zinc-50 via-zinc-50/95 to-transparent px-6 pb-5 pt-12 transition-colors duration-200 dark:from-[#0b0d10] dark:via-[#0b0d10]/95 dark:to-transparent">

            <div className="mx-auto max-w-3xl">

             <ChatInput handleSendMessage={handleSendMessage} disabled={isFileProcessing || pdf == null || loading} />

              <p className="mt-3 text-center text-[10px] text-zinc-500 dark:text-zinc-600">
                PaperMind can make mistakes. Verify important information in your document.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}