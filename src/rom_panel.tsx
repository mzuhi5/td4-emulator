import { useState, useEffect, useRef } from "react";
import { useEmuContext } from "./emu_context";
import { RomEditor } from "./rom_editor";
import { decode, op_str, hasIm, im_str } from './operators'
import { RomDumpPanel } from "./rom_dumper";
import { BDiv, Div, SButton } from './components'

const EditButton = ({ addr, onEdit, setEditNum }) => {
    return (
        <>
            <SButton
                className="border-gray-300"
                onClick={() => {
                    setEditNum(en => (addr == en ? -1 : addr))
                }}
            >+
            </SButton>
            {onEdit &&
                <RomEditor addr={addr} close={() => setEditNum(-1)} />
            }
        </>
    )
}

const Line = ({ i, op, opcode, im }) => {
    return (
        <>
            <div className="px-2 w-[15%]">{i}</div>
            <div className="px-1 w-[20%]">{op}</div>
            <div className="px-1 w-[35%]">({opcode})</div>
            <div className="px-1 w-[15%]">{im}</div>
        </ >
    )
}

const OneCode = ({ i, rom, on, onEdit, setEditNum }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cref = ref?.current;
        if (on && cref) {
            const pElm = cref.parentElement;
            const diff = cref.offsetTop - (pElm.scrollTop + pElm.offsetTop);
            if (diff < 0 || diff > pElm.clientHeight) {
                cref.scrollIntoView();
            }
        }
    }, [on])

    const baseCss = "flex border rounded";
    const cn = onEdit
        ? baseCss + "border-black bg-gray-300"
        : (on ? baseCss + "border border-black bg-orange-200" : baseCss);
    const { op, im } = decode(rom);
    const opcode = op_str(op);
    const imstr = hasIm(op) ? im_str(im) : '----';

    return (
        <div className={cn} ref={ref}>
            <Line i={i} op={op} opcode={opcode} im={imstr} />
            {setEditNum && <EditButton addr={i} onEdit={onEdit} setEditNum={setEditNum} />}
        </div>
    )
}

export const RomPanelBody = ({ pc, rom, editNum, setEditNum = null }) => {
    const [openDump, setOpenDump] = useState(false);
    return (
        <Div className="overflow-hidden">
            <div className={"flex p-1 mb-1 border-b border-black"}>
                <Line i={"n"} op={"op"} opcode={"code"} im={"im"} />
                <SButton onClick={() => setOpenDump(true)} > dump </SButton>
            </div>
            <BDiv className="h-[90%] overflow-auto">
                {rom.map((r, i) =>
                    <OneCode
                        key={i}
                        i={i}
                        rom={r}
                        on={i == pc ? true : false}
                        onEdit={editNum == i}
                        setEditNum={setEditNum}
                    />)}
            </BDiv>
            {openDump && <RomDumpPanel close={() => setOpenDump(false)} />}
        </Div>
    )
}

export const RomReadOnlyPanel = ({ rom }) => {
    return (
        <RomPanelBody
            pc={-1}
            rom={rom}
            editNum={-1}
        />
    )
}

export const RomPanel = () => {
    const [editNum, setEditNum] = useState(-1);
    const { getSROM } = useEmuContext();

    const state = getSROM();
    const cpu = state.cpu;
    const rom = state.rom;
    return (
        <RomPanelBody
            pc={cpu.pc}
            rom={rom}
            editNum={editNum}
            setEditNum={setEditNum}
        />
    )
}
