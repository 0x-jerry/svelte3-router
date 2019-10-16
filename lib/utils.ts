export function traverseNode(rootEl: Node, filter: (el: Node) => boolean, cb: (el: Node) => void) {
  //@ts-ignore
  const nodeIterator = document.createNodeIterator(rootEl, NodeFilter.SHOW_ELEMENT, (node: Node) => {
    return filter(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  })

  while (nodeIterator.nextNode()) {
    cb(nodeIterator.referenceNode)
  }
}

export function sequenceGenerator(start = 0) {
  let _start = start

  return () => _start++
}
