import { useState, useContext, createContext, ReactNode } from "react"
import {
    initSstate, upROM, getOPStr, upROMIm, getOperators, step, StateType,
    getROMIm, getROMOp, upCPU
} from "./operators"


type OmitFirstParam<T extends (...args: any) => any> = T extends (
    ignored: infer _,
    ...args: infer P
) => any ? P : never

type EmuContextType = {
    getSCPU: () => StateType['cpu'];
    upSCPU: (...args: OmitFirstParam<typeof upCPU>) => void;
    getSROM: () => StateType;
    getSROMIm: (...args: OmitFirstParam<typeof getROMIm>) => number;
    getSROMOp: (...args: OmitFirstParam<typeof getROMOp>) => string;
    upSROM: (...args: OmitFirstParam<typeof upROM>) => void;
    upSROMIm: (...args: OmitFirstParam<typeof upROMIm>) => void;
    resetSROM: () => void;
    getOperators: typeof getOperators;
    getOPStr: typeof getOPStr;
    execStep: () => void;
}

const context = createContext({} as EmuContextType)

export const useEmuContext = () => useContext(context)

export const EmuContextProvider = ({ children }: { children: ReactNode }) => {

    const [state, setState] = useState(initSstate);

    return (
        <context.Provider value={{
            getSCPU: () => state.cpu,
            upSCPU: (...args) => setState(s => upCPU(s, ...args)),
            upSROM: (...args) => setState(s => upROM(s, ...args)),
            upSROMIm: (...args) => setState(s => upROMIm(s, ...args)),
            getSROM: () => state,
            getOPStr: getOPStr,
            getSROMIm: (...args) => getROMIm(state, ...args),
            getSROMOp: (...args) => getROMOp(state, ...args),
            getOperators: getOperators,
            execStep: () => setState(s => step(s)),
            resetSROM: () => setState(s => ({ ...s, cpu: initSstate().cpu }))
        }}>
            {children}
        </context.Provider>
    )
}