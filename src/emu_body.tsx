import { useState } from "react"
import { BottomPanel } from "./bottom_panel"
import { RomPanel } from "./rom_panel"
import { StatusPanel } from "./status_panel"
import { EmuContextProvider } from "./emu_context"
import { RomImporter } from "./rom_importer"
import { BDiv, Div, NonHDiv } from "./components"

export const Body = ({ }) => {
    const [onRun, setOnRun] = useState({
        on: false,
        interval: 1000,
        timer: null
    });
    const [onRomFiler, setOnRomFiler] = useState(false);

    return (
        <EmuContextProvider>
            <Div className="p-2 h-[100vh] overflow-hidden">
                <div className="flex justify-between items-center">
                    <h1 className="text-center text-3xl font-bold px-2">
                        TD4-emulator
                    </h1>
                    <a href="https://tech.tekemogu.com/articles/td4-emulator" target="_blank" className="px-5 underline">
                        blog
                    </a>
                </div>
                <BDiv className="h-[90%] overflow-auto">
                    <Div className="h-[90%] flex">
                        <Div className="p-1 w-[40%]">
                            <StatusPanel onRun={onRun} setOnRun={setOnRun} />
                        </Div>
                        <Div className="p-1 w-[60%]">
                            <RomPanel />
                        </Div>
                    </Div>
                    <NonHDiv className="p-1 border-t border-black">
                        <BottomPanel
                            onRun={onRun}
                            setOnRun={setOnRun}
                            setOnRomFiler={setOnRomFiler}
                        />
                    </NonHDiv>
                </BDiv>
                {onRomFiler && <RomImporter setOn={setOnRomFiler} />}
            </Div>
        </EmuContextProvider >
    )
}