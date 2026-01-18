import { useEmuContext } from './emu_context'
import { im_str, hasIm } from './operators'
import { BDiv, BottomPane, Button, Div, PortalPanel } from './components'

const OpLine = ({ addr, op, selected }) => {
    const { upSROM, getOPStr } = useEmuContext();
    return (
        <div className={`flex ${selected && "bg-gray-300"} hover:border border-black`}
            onClick={() => upSROM(addr, op)}
        >
            <div className="px-3"> {op} </div>
            <div className="px-3"> {getOPStr(op)} </div>
        </div>
    )
}

const OperationList = ({ addr }) => {
    const { getOperators, upSROMIm, getSROMIm, getSROMOp } = useEmuContext();

    const isOFF = !hasIm(getSROMOp(addr));
    const isSelected = (op) => getSROMOp(addr) === op;

    return (
        <Div className="p-1 overflow-auto">
            <BDiv className="p-1 h-[90%] overflow-auto">
                {Object.keys(getOperators()).sort().map((op, i) =>
                    <OpLine key={i} addr={addr} op={op} selected={isSelected(op)} />
                )}
            </BDiv >
            <div className="p-1 flex justify-between">
                <div className="p-1">Im: </div>
                <div className="p-1">
                    "{isOFF ? "----" : im_str(getSROMIm(addr))}"
                </div>
                <input className={
                    `p-1 border border-black rounded ${isOFF && "bg-gray-300"}`
                }
                    disabled={isOFF}
                    onChange={e => upSROMIm(addr, parseInt(e.target.value))}
                    type="number" min="0" max="15"
                    value={isOFF ? "" : getSROMIm(addr)}
                />
            </div>
        </Div>
    )
}

export const RomEditor = ({ addr, close }) => {
    return (
        <PortalPanel
            className="w-[35%] h-[80%] left-[3%] top-[10%]"
            title={`addr: ${addr}`}
            bottom={
                <BottomPane>
                    <Button onClick={() => { close() }}>close</Button>
                </BottomPane>
            }>
            <BDiv className="h-full">
                <OperationList addr={addr} />
            </BDiv>
        </PortalPanel>
    )
}