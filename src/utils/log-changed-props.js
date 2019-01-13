export default function logChangedProps(props, prevProps, log=console.log) {
  Object.entries(props).forEach(([key, val]) =>
    prevProps[key] !== val && log(`Prop '${key}' changed`)
  )
}