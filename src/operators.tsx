
export type StateType = {
  cpu: {
    pc: number
    cflag: boolean,
    register_a: number,
    register_b: number,
    output: number,
    input: number,
  },
  rom: number[]
}

export const initSstate = (): StateType => {
  return {
    cpu: {
      pc: 0,
      cflag: false,
      register_a: 0,
      register_b: 0,
      output: 0,
      input: 0,
    },
    rom: [...Array(16)],
  }
}

type CPUType = StateType['cpu'];

type UpCPUType = <K extends keyof CPUType>(
  state: StateType, key: K, value: CPUType[K], cflag?: CPUType['cflag'], pc?: boolean
) => StateType;

export const upCPU: UpCPUType = (s, k, v) =>
  ({ ...s, cpu: { ...s.cpu, [k]: v } })

type UpType = (s: StateType, num?: number) => StateType;

const upPC = (s: StateType, num?: number) =>
  upCPU(s, 'pc', num === undefined ? s.cpu.pc + 1 : num);

const upCflag: UpType = (s, num) =>
  upCPU(s, 'cflag', num > 15 ? true : false);

const addA_Im: UpType = (s, im) => {
  const sum = s.cpu.register_a + im;
  return upPC(upCPU(upCflag(s, sum), 'register_a', sum & 15));
}

const movA_B: UpType = (s) =>
  upPC(upCPU(upCflag(s, 0), 'register_a', s.cpu.register_b));

const inA: UpType = (s) =>
  upPC(upCPU(upCflag(s, 0), 'register_a', s.cpu.input));

const movA_Im: UpType = (s, im) =>
  upPC(upCPU(upCflag(s, 0), 'register_a', im));

const movB_A: UpType = (s) =>
  upPC(upCPU(upCflag(s, 0), 'register_b', s.cpu.register_a));

const addB_Im: UpType = (s, im) => {
  const sum = s.cpu.register_b + im;
  return upPC(upCPU(upCflag(s, sum), 'register_b', (s.cpu.register_b + im) & 15));
}

const inB: UpType = (s) =>
  upPC(upCPU(upCflag(s, 0), 'register_b', s.cpu.input));

const movB_Im: UpType = (s, im) =>
  upPC(upCPU(upCflag(s, 0), 'register_b', im));

const outB: UpType = (s) =>
  upPC(upCPU(upCflag(s, 0), 'output', s.cpu.register_b));

const outIm: UpType = (s, im) =>
  upPC(upCPU(upCflag(s, 0), 'output', im));

const jncIm: UpType = (s, im) =>
  upCflag(upPC(s, s.cpu.cflag ? s.cpu.pc + 1 : im), 0)

const jmpIm: UpType = (s, im) =>
  upCflag(upPC(s, im), 0)

const operators = {
  "0000": ["ADD A,Im", addA_Im, true],
  "0001": ["MOV A,B", movA_B, false],
  "0010": ["IN A", inA, false],
  "0011": ["MOV A,Im", movA_Im, true],
  "0100": ["MOV B,A", movB_A, false],
  "0101": ["ADD B,Im", addB_Im, true],
  "0110": ["IN B", inB, false],
  "0111": ["MOV B,Im", movB_Im, true],
  "1001": ["OUT B", outB, false],
  "1011": ["OUT Im", outIm, true],
  "1110": ["JNC Im", jncIm, true],
  "1111": ["JMP Im", jmpIm, true],
}

export const getOPStr = (code: string): string => operators[code][0];

export const getOperators = () => operators;

export const decode = (code: number) => {
  let op = ("0000" + ((code & 0xf0) >> 4).toString(2)).slice(-4);
  let im = code & 0x0f;
  return { op: op, im: im };
}

export const encode = (opcode: string, im: string) => {
  if (!operators[opcode] || !im) { return NaN; }
  for (let i = 0; i < im.length; i++) {
    if (im[i] !== '0' && im[i] != '1' && i !== im.length) {
      return NaN;
    }
  }
  const opN = parseInt(opcode, 2);
  const imN = parseInt(im, 2);
  return (opN < 16 && imN < 16) ? (opN << 4) + imN : NaN;
}

export const im_str = (n: number) => {
  return ("0000" + (n.toString(2))).slice(-4);
}

export const op_str = (op: string) => {
  return operators[op][0];
}

export const hasIm = (op) => operators[op][2];

export const step = (s: StateType) => {
  let { op, im } = decode(s.rom[s.cpu.pc]);
  let fn = operators[op][1];
  return s.cpu.pc < 16 && fn ? fn(s, im) : s;
}

export const getROMIm = (s: StateType, addr: number) => {
  return decode(s.rom[addr]).im;
}

export const getROMOp = (s: StateType, addr: number) => {
  return decode(s.rom[addr]).op;
}

export const upROM =
  (s: StateType, addr: number, op: string, im?: number): StateType => {
    im = im === undefined ? decode(s.rom[addr]).im : im;
    im = operators[op][2] ? im : 0;
    return {
      ...s,
      rom: s.rom.map((r, i) =>
        i === addr ? encode(op, im_str(im)) : r
      )
    }
  }

export const upROMOp = (s: StateType, addr: number, op: string): StateType =>
  upROM(s, addr, op, decode(s.rom[addr]).im)

export const upROMIm = (s: StateType, addr: number, im: number): StateType =>
  upROM(s, addr, decode(s.rom[addr]).op, im)

export const compileLines = (textLines: string) => {
  return textLines.split('\n').reduce((a, c, i) => {
    c = c.replace(/\/\/.*/, "").replace(/ +/, "");
    if (c === "") {
      return [...a, { text: c, code: 0, result: true }];
    }
    const texts = c.split('_');
    const code = encode(texts[0], texts[1]);
    const ret = isNaN(code)
      ? { text: c, code: 0, result: false }
      : { text: c, code: encode(texts[0], texts[1]), result: true }
    return [...a, ret];
  }, [])
}