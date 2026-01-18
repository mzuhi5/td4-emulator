import { im_str } from "./operators"
import { useEmuContext } from "./emu_context"
import { Div, BDiv } from "./components"

const Input = ({ nm, val, disabled, up }) => {
    const baseCnm = "px-1 min-w-[2em] border border-black rounded"
    const cn = disabled ? `${baseCnm} bg-gray-300` : baseCnm;
    return (
        <input
            className={cn}
            disabled={disabled}
            type='number'
            min={0}
            max={15}
            onChange={e => up(nm, parseInt(e.target.value, 10))}
            value={val}
        />
    )
}

const Output = ({ val }) => {
    const numstr = im_str(parseInt(val));
    return (
        <div className="flex items-center min-w-[2em]" >
            {[...Array(4)].map((_, i) => {
                const color = numstr[i] == "0" ? "bg-white" : "bg-red-600";
                return <div key={i} className={`${color} mx-0.5 w-4 h-4 
                        border-[1px] border-red-600 rounded-full`
                }
                />
            })}
        </div>
    )
}


const Line = ({ nm, n, up, disabled }) => {
    return (
        <div className="p-1 flex w-full">
            <div className="min-w-[5em]"> {nm}:  </div>
            <div className="min-w-[4em]">"{im_str(parseInt(n))}" </div>
            {nm == 'input' || nm == 'pc' ?
                <Input nm={nm} val={n} disabled={disabled} up={up} />
                : nm == 'output'
                    ? <Output val={n} />
                    : <div className="min-w-[2em]"> {n} </div>
            }
        </div>
    )
}

export const StatusPanel = ({ onRun, setOnRun }) => {
    const { getSCPU, upSCPU } = useEmuContext();
    const cpu = getSCPU();
    const freq = 1000 / onRun.interval;

    return (
        <Div className="overflow-hidden">
            <div className="p-2">cpu status:</div>
            <BDiv className="h-[90%] overflow-auto">
                <div>
                    <Line nm={"output"} n={cpu.output} up={upSCPU} disabled={onRun.on} />
                    <Line nm={"input"} n={cpu.input} up={upSCPU} disabled={onRun.on} />
                    <Line nm={"register a"} n={cpu.register_a} up={upSCPU} disabled={onRun.on} />
                    <Line nm={"register b"} n={cpu.register_b} up={upSCPU} disabled={onRun.on} />
                    <Line nm={"cflag"} n={cpu.cflag ? 1 : 0} up={upSCPU} disabled={onRun.on} />
                    <Line nm={"pc"} n={cpu.pc} up={upSCPU} disabled={onRun.on} />
                </div>
                <div className="w-full py-10 px-1 flex">
                    <div className="min-w-[5em]"> clock:  </div>
                    <Input
                        nm="clock"
                        val={freq}
                        disabled={onRun.on}
                        up={(_, val) => setOnRun(s => ({
                            ...s,
                            interval: val === 0 ? 1000 : 1000 / val
                        }))}
                    />Hz
                </div>
            </BDiv>
        </Div >
    )
}