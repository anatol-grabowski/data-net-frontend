import * as svgIntersections from 'svg-intersections'
const { intersect, shape } = svgIntersections

export function cutEdge(points, fromSize, toSize) {
  let [p1, p2] = points
  const [[x1, y1], [x2, y2]] = points

  const border = 2
  const r = 10
  let [fw, fh] = fromSize
  fw -= border
  fh -= border
  const intsFrom = intersect(
    shape('line', { x1, y1, x2, y2 }),
    shape('rect', { x: x1 - fw/2, y: y1 - fh/2, width: fw, height: fh, rx: r, ry: r }),
  )
  if (intsFrom.points.length > 0) {
    p1 = [intsFrom.points[0].x, intsFrom.points[0].y]
  }

  let [tw, th] = toSize
  tw -= border
  th -= border
  const intsTo = intersect(
    shape('line', { x1, y1, x2, y2 }),
    shape('rect', { x: x2 - tw/2, y: y2 - th/2, width: tw, height: th, rx: r, ry: r }),
  )
  if (intsTo.points.length > 0) {
    p2 = [intsTo.points[0].x, intsTo.points[0].y]
  }

  return [p1, p2]
}
