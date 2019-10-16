export function traverseNode(rootEl: Node, filter: (el: HTMLElement) => boolean, cb: (el: HTMLElement) => void) {
  //@ts-ignore
  const nodeIterator = document.createNodeIterator(rootEl, NodeFilter.SHOW_ELEMENT, (node: HTMLElement) => {
    return filter(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  })

  while (nodeIterator.nextNode()) {
    cb(nodeIterator.referenceNode as HTMLElement)
  }
}

export function sequenceGenerator(start = 0) {
  let _start = start

  return () => _start++
}
