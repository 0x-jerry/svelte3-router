interface IEvent<T> {
  id: number
  cb: (arg: T) => void
}

export class Event<T = any> {
  name?: string
  events: IEvent<T>[]
  id: number

  constructor(name?: string) {
    this.name = name
    /**
     * {id, cb}
     */
    this.events = []
    this.id = 0
  }

  on(cb: IEvent<T>['cb']) {
    const find = this.events.find((e) => e.cb === cb)
    if (!find) {
      return
    }

    this.events.push({
      id: ++this.id,
      cb
    })

    return this.id
  }

  off(idOrCb: number | IEvent<T>['cb']) {
    const idx = this.events.findIndex((e) => {
      if (typeof idOrCb === 'number') {
        return e.id === idOrCb
      } else {
        return (e.cb = idOrCb)
      }
    })

    if (idx < 0) {
      return
    }

    this.events.splice(idx, 1)
  }

  emit(arg: T[]) {
    this.events.forEach((e) => {
      e.cb(arg)
    })
  }
}

export const routeEvent = new Event()
