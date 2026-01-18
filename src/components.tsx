import { useEffect, useState } from "react";
import { createPortal } from 'react-dom'
import { twMerge } from "tailwind-merge"

export const Div = ({ className = null, ...props }) => {
    className = twMerge("w-full h-full", className);

    return (
        <div className={className} {...props}>
            {props.children}
        </div>
    )
}

export const BDiv = ({ className = null, ...props }) => {
    className = twMerge("border border-black rounded", className);
    return (
        <Div className={className} {...props}>
            {props.children}
        </Div>
    )
}

export const NonHDiv = ({ className = null, ...props }) => {
    className = twMerge("w-full", className);
    return (
        <div className={className} {...props}>
            {props.children}
        </div>
    )
}

export const Button = ({ className = null, disabled = null, ...props }) => {

    className = twMerge(
        `p-1 min-w-[3em] text-center shadow
         border border-black border-b-2 border-r-2 rounded`,
        className
    );
    className = disabled == true ? twMerge("bg-gray-300", className) : className;

    return (
        <button className={className} disabled={disabled} {...props}>
            {props.children}
        </button>
    )
}

export const SButton = ({ className = null, ...props }) => {
    return (
        <Button className={twMerge("p-0", className)} {...props}>
            {props.children}
        </Button>
    )
}

export const BottomPane = ({ children }) => {
    return (
        <Div className="flex gap-3">
            <div className="grow" />
            <div className="p-1 flex gap-3 justify-between">
                {children}
            </div>
        </Div>
    )
}

export const PortalPanel = ({ className = null, title, bottom, children = null }) => {
    const [onDraw, setOnDraw] = useState(false);
    useEffect(() => {
        setOnDraw(true);
    }, [])

    className = twMerge(`
        fixed top-[5%] left-[5%] w-[90%] h-[90%] 
        p-3 overflow-auto bg-white
         `, className);
    return (
        onDraw && createPortal(
            <BDiv className={className}>
                <Div className="p-1">
                    {title}
                    <BDiv className="h-[90%]">
                        <Div >
                            {children}
                        </Div>
                        <NonHDiv className="p-1 border-t border-black">
                            {bottom}
                        </NonHDiv>
                    </BDiv>
                </Div>
            </BDiv >
            , document.body)
    )
}