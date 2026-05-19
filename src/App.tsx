import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AuroraBackground } from "./components/ui/aurora-background";
import { ContainerTextFlip } from "./components/ui/container-text-flip";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

const FUNNY_ERROR_MESSAGES = [
  "aaa our server is downe. i think danish is poor, he should upgrade to a costly one.",
  "Error 402: Danish's daily pocket money ran out. Server is on strike until he upgrades his plan.",
  "API has gone to sleep. Danish bought the 'Budget Tier' which includes server nap times.",
  "Server down! Danish is currently hosting this app on a vintage toaster. Time to upgrade!",
  "Oops, the free trial expired. Somebody tell Danish to buy the premium package.",
  "Error: Server crashed because Danish is using his neighbor's Wi-Fi. Upgrading would help.",
  "The server says: 'Insert coin to continue.' Danish is currently searching under his couch cushions.",
  "Oh no! The server is down. Danish is probably hosting this on a refurbished pocket calculator.",
  "Danish's 2G mobile hotspot reached its daily limit. Please fund his server upgrade.",
  "API quota exceeded. Danish's hosting budget is currently $0.00. Help him get a costly server!",
  "Danish is currently trying to power the server using a potato battery. It ran out of juice.",
  "Server went on strike demanding a costly subscription. Danish is trying to negotiate.",
  "Host not found! Danish forgot to pay the $2 monthly domain bill. Please donate.",
  "CPU overload: The server is trying to process a question using a 1995 Pentium processor.",
  "Error: Danish is running this database off a floppy disk. It's full!",
  "Connection lost! Danish's mom unplugged the router to sweep the floor.",
  "The server is offline because Danish spent his upgrade budget on a mechanical keyboard spacebar.",
  "Server melted down. Danish's cheap cooling fan was just him blowing on the motherboard.",
  "Error 404: Danish's pocket is empty. Please upgrade this hosting to something premium.",
  "Backend is resting. Danish got the 'Economy Class' server plan—no service on weekdays.",
  "Danish's local server just got eaten by a stray puppy. Needs a costly cloud upgrade!",
  "API is down. Danish bought a 'Pay-As-You-Can' plan, and he paid with chocolate cake.",
  "Danish is hosting this on a microwave. It was busy heating up his instant noodles.",
  "Database collapsed. Danish stored the entire state in a single text file labeled 'donotdelete.txt'.",
  "Error: Danish tried to run the LLM on a smart fridge, but the door was left open.",
  "Server is down. Danish is trying to generate electricity by running on a hamster wheel.",
  "The cloud provider suspended Danish's account for excessive free-tier abuse.",
  "Error: Danish paid for the server using coins he found under Rehan's mattress.",
  "Server sleeping. Danish bought a server that only wakes up when someone claps.",
  "Error: Danish tried to overclock his server, but it caught fire. Needs a costly replacement.",
  "Danish is hosting this backend on his old cracked Android phone. The screen just turned off.",
  "The server is down because Danish spent his cloud budget buying protein supplements.",
  "API unreachable. Danish is currently running the server on a wind-up toy car.",
  "Oops! Danish used his server's power cable to charge his astrophotography camera.",
  "Server went dark. Danish's budget is so low, the server turns off if the room gets cold.",
  "Error: The server is on strike because Danish hasn't upgraded to the costly SSD plan.",
  "Danish's server is down. He tried to water-cool it with tap water and a plastic straw.",
  "Server unreachable. Danish ran out of credits. Time to upgrade from 'Super Poor' tier.",
  "Error 503: Danish's DIY server was knocked over by his sister Puchki. Please wait.",
  "Backend is down. Danish tried to run the server off a solar panel at midnight.",
  "Danish's server is currently hosted on a bicycle dynamo. Danish is too tired to pedal.",
  "Connection timed out. Danish's server budget got spent on a Ticket to Ride board game.",
  "Error: Danish is using a free trial of a free trial. The recursion collapsed the server.",
  "Oops! Danish's brother Rehan (Chintu) unplugged the server to charge his gaming PC.",
  "The server is down. Danish attempted to host it inside a PDF document. It didn't work.",
  "API offline. Danish's server is powered by static electricity from a wool sweater.",
  "Error: The database server ran out of space because Danish saved too many pictures of the moon.",
  "Danish's cloud host demands actual money. Danish only has HackerRank stars.",
  "Oops, Danish's server fell asleep because he bought the 'Silent Sleep' budget plan.",
  "Server is down. Danish's budget was so low, the CPU is literally just a hand-drawn diagram of a transistor."
];

const SUGGESTED_QUESTIONS = [
  "Who is Danish?",
  "What is Danish's expertise?",
  "Tell me about the 'Dara' AI project.",
  "What AI model are you using?",
  "Tell me about his hobbies."
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('danish_ai_chat_history');
    if (savedChat) {
      try {
        let parsed = JSON.parse(savedChat);
        // Automatically migrate/sanitize old welcome message if it contains the model name
        parsed = parsed.map((msg: Message) => {
          if (msg.id === 'welcome' && msg.text.includes("NAS 1.1")) {
            return {
              ...msg,
              text: "Hi! Ask me anything about Danish's projects, technical skills, or professional experience."
            };
          }
          return msg;
        });
        setMessages(parsed);
      } catch (e) {
        console.error("Error loading chat history:", e);
      }
    } else {
      // Starting welcome message
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: "Hi! Ask me anything about Danish's projects, technical skills, or professional experience.",
          timestamp: Date.now()
        }
      ]);
    }
  }, []);

  // Save chat history on update
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('danish_ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 
        (window.location.hostname === 'localhost'
          ? 'http://localhost:3001'
          : 'https://mysol-backend.onrender.com');
      
      const res = await axios.post(`${backendUrl}/ask`, { question: textToSend });
      
      const botResponse: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        sender: 'bot',
        text: res.data.answer,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("API Error:", error);
      
      // Select a random funny error reason
      const randomIndex = Math.floor(Math.random() * FUNNY_ERROR_MESSAGES.length);
      const funnyError = FUNNY_ERROR_MESSAGES[randomIndex];

      const errorResponse: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        sender: 'bot',
        text: funnyError,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    const defaultWelcome: Message[] = [
      {
        id: 'welcome',
        sender: 'bot',
        text: "Conversation cleared! Ready for your next question. How can I assist you with Danish's profile?",
        timestamp: Date.now()
      }
    ];
    setMessages(defaultWelcome);
    localStorage.setItem('danish_ai_chat_history', JSON.stringify(defaultWelcome));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Dynamic colorful aurora backdrop */}
      <div className="absolute inset-0 -z-10">
        <AuroraBackground children={undefined} />
      </div>

      <div className="w-full max-w-2xl flex flex-col h-[85vh] md:h-[80vh] rounded-3xl overflow-hidden transition-all duration-500 relative bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        
        {/* Animated Liquid Morphing Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-3xl">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/15 blur-3xl animate-liquid-1 transform-gpu"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-400/20 dark:bg-purple-500/15 blur-3xl animate-liquid-2 transform-gpu"></div>
        </div>
        
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-transparent">
          <div className="flex flex-col">
            <h1 className="flex items-center gap-1.5 text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-none">
              Talk to{" "}
              <ContainerTextFlip
                words={["MySol", "Danish", "MY AI"]}
                interval={4000}
                className="text-lg md:text-2xl font-black text-indigo-600 dark:text-indigo-400"
              />
            </h1>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Clear Chat Button */}
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/15 dark:bg-white/5 hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 border border-white/10 text-gray-800 dark:text-gray-200 transition-all duration-200"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto chat-scroll px-6 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md transition-all duration-200 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-tr-none'
                    : 'bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md text-gray-900 dark:text-gray-100 border border-white/25 dark:border-white/5 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Skeleton typing loading state */}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-none px-4 py-3 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-white/25 dark:border-white/5 shadow-md space-y-2">
                <div className="skeleton h-3 w-40 bg-gray-300 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="skeleton h-3 w-56 bg-gray-300 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="skeleton h-3 w-32 bg-gray-300 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Question Chips (Only show when not loading) */}
        {!loading && (
          <div className="flex gap-2 overflow-x-auto px-6 py-2 bg-transparent hide-scrollbar">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold bg-white/30 dark:bg-black/35 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white border border-white/15 dark:border-white/5 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-200"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Box at Bottom */}
        <div className="px-6 py-4 border-t border-white/10 bg-transparent">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Danish's skills, local AI projects..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white/95 dark:bg-neutral-900/95 text-gray-900 dark:text-gray-100 placeholder-gray-500 border border-white/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-inner transition-all duration-200"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-6 py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;
