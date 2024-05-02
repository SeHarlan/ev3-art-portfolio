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
  { text: "Hello my name is EV3 and I like playing with code." },
  { type: "break", text: "" },
  { type: "break", text: "" },
  { text: "I like " },
  { type: "delete", text: "playing with new technology and techniques" },
  { type: "delete", text: "going down unknown and untrodden paths" },
  { text: "experimenting and pushing boundaries." },
  { type: "break", text: "" },
  { text: "I like " },
  { type: "delete", text: "revealing unspoken thoughts" },
  { type: "delete", text: "exploring the shadow and light in our souls" },
  { text: "evoking emotions." },
  { type: "break", text: "" },
  { text: "I like " },
  { type: "delete", text: "creating beauty from chaos" },
  { type: "delete", text: "showcasing beauty in the mundane" },
  { text: "making the world a more beautiful place." },
  { type: "break", text: "" },
  { type: "break", text: "" },
  { text: "This website showcases a few of my long-form and interactive generative art pieces." },
  { type: "break", text: "" },
  { text: "Each long-form generative algorithm is meant to be enjoyed as a whole collection with multiple viewings, where each iteration is part of a greater composition." },
  { type: "break", text: "" },
  { type: "break", text: "" },
  { text: "The algorithm itself is the art." },
  // { type: "break", text: "" },
  // { type: "break", text: "" },
  // { text: "Double click an icon or tap the 'Start' menu to choose a piece to view." },
  // { type: "break", text: "" },
  // { text: "For collections minted as individual NFTs you can input the mint address in the 'Seed' field to view and interact with your art." },
  // { type: "break", text: "" },
  // { text: "You can learn more about each piece by clicking 'About' in the window menu." },
  // { type: "break", text: "" },
  // { text: "Some pieces are available for trade on secondary marketplaces, links for these are also found in the window menu." },
  
  { type: "break", text: "" },
  { type: "break", text: "" },
  { text: "Thank you for visiting and viewing my art, it really means so much to me." },
  { type: "break", text: "" },
  { text: "Please enjoy and feel free to reach out any time!" },

  { type: "break", text: "" },
  { type: "break", text: "" },
  { text: "You can follow me on social media below as well as check out my Collector gallery page which houses all of my other artworks." },
  { type: "element", text: "", element: <Links className="p-2 flex gap-2 w-full justify-center" /> },
]



const HomeWindow: FC = () => {
  const [display, setDisplay] = useState<(JSX.Element | null)[]>([])
  const [contentIndex, setContentIndex] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [isSkipping, setIsSkipping] = useState(false)

  const delay = useRef(50);
  const delayBuffer = 0.8
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
        case "element": { 
          newDisplay[contentIndex] = <div key={makeKey(contentIndex)}>{contentObj.element}</div>
          setDisplay(newDisplay)

          setTimeout(() => handleNextContent(), 2500)
          break;
        }
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
              delay.current = 450
              reverse.current = true;
            }
          }
          break;
        };
        case "break": { 
          delay.current = 80
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
        delay.current = 300;
        setTextIndex(0)
        setContentIndex(prev => prev + 1)
      }

      if (elComplete.current) handleNextContent();
      if (myDivRef.current) myDivRef.current.scrollTop = myDivRef?.current.scrollHeight;
    }, delay.current * delayBuffer)


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
        case "element": return <div key={makeKey(contentIndex)}>{contentObj.element}</div>;
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