type OnAction = () => void;
type Options = { onAction: OnAction; excludes?: EventTarget[] };

export default function clickOutside(node: HTMLElement, { onAction, excludes = [] }: Options) {
    const handleClick = (event: UIEvent) => {
        if (!excludes.includes(event.target) && !event.composedPath().includes(node)) {
            event.stopImmediatePropagation();
            onAction();
        }
    };
    document.addEventListener('click', handleClick);
    return {
        destroy() {
            document.removeEventListener('click', handleClick);
        },
    };
}
