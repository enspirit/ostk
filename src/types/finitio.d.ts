declare module 'finitio' {

  export class Type {
    dress<T>(obj: any): T
  }

  export class System {
    Main?: Type
  }

  export default class Finitio {
    static system(fio: string): System
  }
}
