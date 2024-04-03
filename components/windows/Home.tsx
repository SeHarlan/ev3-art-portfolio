import Image from "next/image"
import { FC, useState, useEffect, useRef } from "react"
import { WINDOWS, useWindowsContext } from "../../context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import Links from "../Links"

const web3Links = [
  { label: "it's just noise", windowKey: WINDOWS.NOISE },
  { label: "Maurer Expanse", windowKey: WINDOWS.MAURER },
]
const personalLinks = [
  {label: "Cards Against Humanity", windowKey: "HAC"}
]

const contentList = [
  { text: "Hello and welcome to the art portfolio of EV3" },
  { type: "break", text: "" },
  { type: "break", text: "" },
  { text: "This site is currently still a work in progress but feel free to look around and enjoy!" },
  // { type: "break", text: "" },
  // { type: "break", text: "" },
  // { type: "delete", text: " the best developer ever!!!" },
  // { type: "delete", text: " . . . " },
  // { text:" Scott Harlan : )"},
  // { type: "break", text: "" },
  // { type: "break", text: "" },
  // { text: "My favorite thing to do is get creative and create compelling experiences!"},
  // { text: " When I'm not coding for my day job, I'm coding generative art." },
  // { text: " (Click on the canvas for a new random pattern)" },
  // // { type: "element", text: "", element: <Maurer className="relative z-10 w-[200px] h-[200px] mx-auto cursor-pointer" /> },
  // { text: "The past few years I've been working as an independent contractor for various web3 startups." },
  // { text: " Currently I am the co-founder and lead developer for a digital art gallery platform called Collector." },
  // { type: "break", text: "" },
  // { type: "break", text: "" },
  // { text: "I code most projects from the ground up, sometimes helping design them as well." },
  // { text: " Always focusing on the smoothest user experience possible."},
  // { text: " Then I integrate them with various blockchain sdks so users can interact with smart contracts and send transactions."},
  // { type: "break", text: "" },
  // { type: "break", text: "" },
  // { text: "These are a few of my favorites so far: " },
  // { type: "links", text: "", links: web3Links },
  // { type: "break", text: "" },
  // { text: "Before that I worked for a company called BrandLive where I coded modular, customizable website components as well as the companion editor that helped users build their own customized streaming sites." },
  // { type: "break", text: "" },
  // { type: "break", text: "" },
  // { text: "So anyways, that's a little bit about my coding experience." },
  // { text: " I also love to play and write music, and I'm a huge fan of the outdoors, making terrariums and bouldering!" },
  // { type: "break", text: "" },
  // { type: "break", text: "" },
  // { type: "delete", text: "I hope you hire me!" },
  // { text: " " },
  // { type: "delete", text: "¯\\_(ツ)_/¯"},
  // { text: "Thank you for checking out my work." },
  // { text: " Please reach out to me via Email or LinkedIn anytime!" },
  // { type: "break", text: "" },
  // { type: "element", text: "", element: <Links className="p-2 flex gap-2 w-full justify-center"/> },
]



const HomeWindow: FC = () => {
  const [display, setDisplay] = useState<(JSX.Element | null)[]>([])
  const [contentIndex, setContentIndex] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [isSkipping, setIsSkipping] = useState(false)

  const delay = useRef(50);
  const elComplete = useRef(false);
  const reverse = useRef(false);
  const myDivRef = useRef<HTMLDivElement>(null);
  const timerId = useRef<NodeJS.Timeout>();

  const makeKey = (index: number) => `content-${index}-${Math.random()}`

  useEffect(() => {
    if (isSkipping) return;
    timerId.current = setTimeout(() => {
      if(contentIndex >= contentList.length) return

      const contentObj = contentList[contentIndex];
      elComplete.current = false;
      const newDisplay = [...display];

      switch (contentObj.type) {
        // case "element": { 
        //   newDisplay[contentIndex] = <div key={makeKey(contentIndex)}>{contentObj.element}</div>
        //   setDisplay(newDisplay)

        //   setTimeout(() => handleNextContent(), 2500)
        //   break;
        // }
        // case "links": { 
        //   if (!contentObj.links || textIndex > contentObj.links.length) elComplete.current = true;
        //   else {
        //     const el = (<WindowLinksWrapper key={makeKey(contentIndex)}>
        //       {contentObj.links?.map((linkProps, index) => {
        //         if (index > textIndex) return null
        //         return <WindowLink key={linkProps.label} {...linkProps} />
        //       })}
        //     </WindowLinksWrapper>)

        //     newDisplay[contentIndex] = el
        //     setDisplay(newDisplay)
        //     setTextIndex(prev => prev + 1)
        //     delay.current = 400
        //   }
        //   break;
        // };
        case "delete": { 
          const text = contentObj.text.slice(0, textIndex)
          const el = <span key={makeKey(contentIndex)}>{text}</span>
          newDisplay[contentIndex] = el
          setDisplay(newDisplay)

          if (reverse.current) {
            setTextIndex(prev => prev - 1)
            //end condition
            if (textIndex <= 0) {
              elComplete.current = true
              reverse.current = false;
            }
            delay.current = 15
          } else {
            setTextIndex(prev => prev + 1)
            delay.current = 50
            // middle condition (start the delete)
            if (textIndex > contentObj.text.length) {
              delay.current = 500
              reverse.current = true;
            }
          }
          break;
        };
        case "break": { 
          delay.current = 100
          const el = <br key={makeKey(contentIndex)} />
          newDisplay[contentIndex] = el
          setDisplay(newDisplay)    
          elComplete.current = true;
          break;
        };
        default: {
          if (textIndex > contentObj.text.length) elComplete.current = true;
          else {
            const text = contentObj.text.slice(0, textIndex)
   
            const el = <span key={makeKey(contentIndex)}>{text}</span>
            newDisplay[contentIndex] = el
            setDisplay(newDisplay)
            setTextIndex(prev => prev + 1)
            delay.current = 30
          }
          break;
        }
      }

      function handleNextContent() {
        delay.current = 400
        setTextIndex(0)
        setContentIndex(prev => prev + 1)
      }

      if (elComplete.current) handleNextContent();
      if (myDivRef.current) myDivRef.current.scrollTop = myDivRef?.current.scrollHeight;
    }, delay.current)


    return () => clearTimeout(timerId.current)
  }, [contentIndex, textIndex])
  
  useEffect(() => {
    if (!myDivRef.current || isSkipping || contentIndex >= contentList.length) return;
    // Scroll to the bottom of the div when the component updates
    myDivRef.current.scrollTop = myDivRef.current.scrollHeight;
  });

  const skip = () => {
    if(isSkipping) return
    clearTimeout(timerId.current)
    setIsSkipping(true)
    setDisplay([])
    const content: (JSX.Element | null)[] = contentList.map((contentObj) => {
      switch (contentObj.type) {
        // case "element": return <div key={makeKey(contentIndex)}>{contentObj.element}</div>;
        // case "links": return (
        //   <WindowLinksWrapper key={makeKey(contentIndex)}>
        //     {contentObj.links?.map((linkProps) => <WindowLink key={linkProps.label} {...linkProps} />)}
        //   </WindowLinksWrapper>
        // );
        case "delete": return null;
        case "break": return <br key={makeKey(contentIndex)} />
        default: return <span key={makeKey(contentIndex)}>{contentObj.text}</span>
      }
    })
    setDisplay(content)
  }
  const reset = () => { 
    setIsSkipping(false)
    setDisplay([])
    setContentIndex(0)
    setTextIndex(0)
  }

  const menu: WindowMenuItem[] = [
    {
      label: "Skip",
      function: skip
    },
    {
      label: "Reset",
      function: reset
    }
  ]

  const initSize = {
    h: 600,
    w: 800,
  }
  const initPos = {
    x: 150,
    y: 100
  }
  
  return (
    <Window windowKey={WINDOWS.HOME} initSize={initSize} initPosition={initPos} menu={menu}>
      <div className="bg-amber-50 h-full overflow-x-hidden p-3" ref={myDivRef}>
        {display}      
      </div>
    </Window>
  )
}

export default HomeWindow

const WindowLinksWrapper: FC<{children?: (JSX.Element| null)[]}> = ({children}) => {
  return (
    <div className="flex gap-3">
      {children}
    </div>
  )
}

const WindowLink: FC<{ windowKey: string, label: string }> = ({ windowKey, label }) => {
  const { handleOpen } = useWindowsContext()

  const open = () => handleOpen(windowKey);
  return (
    <button onClick={open} className="underline">
      {label}
    </button>
  )
}