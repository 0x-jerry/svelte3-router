export function traverseNode(rootEl: Node, filter: (el: HTMLElement) => boolean, cb: (el: HTMLElement) => void) {
  //@ts-ignore
  const nodeIterator = document.createNodeIterator(rootEl, NodeFilter.SHOW_ELEMENT, (node: HTMLElement) => {
    return filter(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  })

  while (nodeIterator.nextNode()) {
    cb(nodeIterator.referenceNode as HTMLElement)
  }
}

export function sequenceGenerator(start = 1000): () => string {
  let _start = start

  return () => {
    return (_start++).toString()
  }
}

export function isGrandparent(el: HTMLElement, grandparent: HTMLElement): boolean {
  let cur = el
  while (cur.parentElement) {
    if (cur.parentElement === grandparent) {
      return true
    }
    cur = cur.parentElement
  }

  return false
}
