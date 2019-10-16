interface IEvent<T> {
  id: number
  cb: (arg: T) => void
}

export class Event<T = any> {
  name?: string
  events: {
    [type: string]: IEvent<T>[]
  }
  id: number

  constructor(name?: string) {
    this.name = name
    /**
     * {id, cb}
     */
    this.events = {}
    this.id = 0
  }

  on(type: string, cb: IEvent<T>['cb']) {
    const events = this.events[type] || (this.events[type] = [])
    const find = events.find((e) => e.cb === cb)

    if (find) {
      return
    }

    events.push({
      id: ++this.id,
      cb
    })

    return this.id
  }

  off(type: string, idOrCb: number | IEvent<T>['cb']) {
    const events = this.events[type] || (this.events[type] = [])

    const idx = events.findIndex((e) => {
      if (typeof idOrCb === 'number') {
        return e.id === idOrCb
      } else {
        return (e.cb = idOrCb)
      }
    })

    if (idx < 0) {
      return
    }

    events.splice(idx, 1)
  }

  emit(type: string, arg: T) {
    const events = this.events[type] || (this.events[type] = [])

    events.forEach((e) => {
      e.cb(arg)
    })
  }
}
