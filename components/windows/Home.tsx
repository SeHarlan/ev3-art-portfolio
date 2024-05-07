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
// as an artist i aim to disassemble and reconstruct the filters we place on reality
//  
// allowing myself and the viewer to reexamine the ordinary and cliche as well as confront the challenging or ignored
//  
// finding beauty
// evoking emotion
// exploring ideas
//  
// hoping this helps us in our journey to better the internal and external worlds we live in
const contentList = [
  { text: "hello my name is EV3" },
  { type: "break", text: "" },
  { text: "i like "},
  { type: "delete", text: "experimenting and pushing boundaries" },
  { type: "delete", text: "finding beauty in the chaos" },
  { type: "delete", text: "exploring emotion" },
  { text: "playing with code :)" },
  { type: "break", text: "" },
  { type: "break", text: "" },


  { text: "as an artist i aim to disassemble and reconstruct the filters we place on reality" },
  { type: "break", text: "" },
  { type: "break", text: "" },
  { text: "to reexamine the ordinary and cliche"},
  { type: "break", text: "" },
  {text : "to confront the challenging or ignored"},
  { type: "break", text: "" },
  { text: "to evoke emotion" },
  { type: "break", text: "" },
  { text: "to find beauty" },
  { type: "break", text: "" },
  { type: "break", text: "" },

  { text: "hoping this helps us on our journey to better the internal and external worlds we live in" },
  { type: "break", text: "" },
  { type: "break", text: "" },
  { text: "- - -"},
  { type: "break", text: "" },

  { text: "thank you for visiting and viewing my art" },
  { type: "break", text: "" },
  { text: "it really means so much to me"},
  { type: "break", text: "" },
  { text: "please enjoy and feel free to reach out any time" },

  { type: "break", text: "" },
  { type: "break", text: "" },
  // { text: "you can follow me on social media below as well as check out my Collector gallery page which houses all of my other artworks." },
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
              delay.current = 550
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