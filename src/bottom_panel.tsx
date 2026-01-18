import { useEmuContext } from './emu_context'
import { Button, BottomPane } from './components';


export const BottomPanel = ({ onRun, setOnRun, setOnRomFiler }) => {
    const { execStep, resetSROM } = useEmuContext();
    const clickPlay = () => {
        if (!onRun.on) {
            let timer = setInterval(execStep, onRun.interval);
            setOnRun({ ...onRun, on: true, timer: timer });
        } else {
            clearInterval(onRun.timer);
            setOnRun({ ...onRun, on: false, timer: null });
        }
    }

    return (
        <BottomPane>
            <Button disabled={onRun.on} onClick={() => execStep()}>
                step
            </Button>
            <Button onClick={clickPlay} >
                {onRun.on ? "stop" : "play"}
            </Button>
            <Button disabled={onRun.on} onClick={() => setOnRomFiler(true)} >
                import
            </Button>
            <Button disabled={onRun.on} onClick={() => resetSROM()}>
                reset
            </Button>
        </BottomPane>
    )
}
