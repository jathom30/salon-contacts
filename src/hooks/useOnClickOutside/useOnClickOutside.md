# useOnClickOutside

A hook for allowing the user to click outside of an element to perform some action, for example: clicking outside of a modal to close the modal.

---

## Ins and Outs

### Inputs

- `ref: RefObject<HTMLElement> | RefObject<HTMLElement>[]`: This can be a single ref or a list of refs from the useRef hook. The handler will be called only when the click originates from outside all the nodes referenced. Note: Multiple refs are useful when using ReactDOM.createPortal for dropdowns, flyouts, tooltips, etc., allowing the handler to be ignored when the click originates inside the main component or any elements of the component spawned elsewhere in the DOM by createPortal.
- `handler: (event: Event) => void`: The function called when the a click occurs outside all of the referenced DOM nodes.

---

## Uses:

useOnClickOutside uses useEffect to add an event listener to a component for actions performed when clicking outside that component.

```tsx
export const MyComponent = () => {
  useOnClickOutside(ref, offClick)
  return <div>Component with outside click</div>
}
```
