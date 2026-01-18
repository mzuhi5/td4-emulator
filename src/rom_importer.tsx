import { useState } from 'react'
import { useEmuContext } from './emu_context'
import { decode, compileLines } from './operators'
import { Button, Div, PortalPanel, BottomPane } from './components'

const sampleCode = `
1001_0000 // OUT B 0000
0101_0001 // ADD B,Im 0001
1110_0000 // JNC Im 0000
`.replace(/^\n/, "");

const ErrLine = ({ codeText, lineNum }) => {
    return (
        <div className="flex">
            <div className="pr-2"> error: </div>
            <div className="pr-2"> {codeText} </div>
            <div> at line {lineNum} </div>
        </div>
    )
}

const StatusPane = ({ compiledList, isSuccess }) => {
    return (
        <>
            {isSuccess
                ? <div>compile succeeded</div>
                : compiledList.map((line, i) =>
                    line.result
                    || <ErrLine key={i} codeText={line.text} lineNum={i + 1} />
                )}
        </>
    )
}

const importRom = (lines, up) => {
    for (let i = 0; i < 16; i++) {
        if (i >= lines.length) {
            up(i, "0000", 0);
            continue;
        }
        const { op, im } = decode(lines[i]);
        up(i, op, im);
    }
}

export const RomImporter = ({ setOn }) => {

    const { upSROM } = useEmuContext();
    const [textBuffer, setTextBuffer] = useState(sampleCode);
    const cmpList = compileLines(textBuffer);
    const isSuccess = cmpList?.[0].code && cmpList.reduce((a, c) => a && c.result, true)
    const exeImport = () => {
        importRom(cmpList.map(c => c.code), upSROM);
        setOn(false);
    }

    return (
        <PortalPanel title="edit below sample code:" bottom={
            <BottomPane>
                <Button disabled={!isSuccess} onClick={exeImport} > ok </Button>
                <Button onClick={() => { setOn(false) }}> cancel </Button>
            </BottomPane>
        }>
            <Div >
                <Div className="h-[80%] overflow-auto">
                    <textarea
                        className="w-full h-full resize-none"
                        onChange={e => {
                            setTextBuffer(
                                e.target.value.split('')
                                    .filter(s => s.match(/[0-9a-zA-Z _\n\/]/))
                                    .join('')
                            )
                        }}
                    >
                        {sampleCode}
                    </textarea>
                </Div>
                <Div className="h-[20%] border-t border-black overflow-auto">
                    <StatusPane
                        compiledList={cmpList}
                        isSuccess={isSuccess}
                    />
                </Div>
            </Div>
        </PortalPanel >
    )
}
