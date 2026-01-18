import { useEmuContext } from './emu_context'
import { decode, im_str, op_str } from './operators'
import { BottomPane, Button, Div, PortalPanel } from './components'

const formatRomText = (romList) =>
    romList.map((r, i) => {
        const { op, im } = decode(r);
        const opStr = op_str(op);
        const imStr = im_str(im);
        return `${op}_${imStr} \/\/ ${opStr} ${imStr}`
    }).join('\n');

export const RomDumpPanel = ({ close }) => {
    const { getSROM } = useEmuContext();

    return (
        <PortalPanel
            title="dumped rom code:"
            bottom={
                <BottomPane>
                    <Button onClick={() => close()}>close</Button>
                </BottomPane>
            }>
            <Div className="h-[90%] whitespace-pre-wrap overflow-auto">
                {formatRomText(getSROM().rom)}
            </Div>
        </PortalPanel>
    )
}