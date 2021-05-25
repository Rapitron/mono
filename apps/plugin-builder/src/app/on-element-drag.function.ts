import { IPoint, Point } from '@rapitron/core';
import { fromEvent } from 'rxjs';
import { first, takeWhile } from 'rxjs/operators';

export function onElementDrag(event: React.MouseEvent<HTMLElement>, callback: (delta: IPoint) => void, dragEnd?: (delta: IPoint) => void) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const isResizable = (resize => resize === 'both' || resize === 'horizontal' || resize === 'vertical')(target.style.resize);
    const isResizing = rect.x + rect.width - event.clientX < 10 && rect.y + rect.height - event.clientY < 10;
    if (!isResizable || !isResizing) {
        event.stopPropagation();
        event.preventDefault();
        let dragging = true;
        let origin = Point.create(event.clientX, event.clientY);
        fromEvent<MouseEvent>(document, 'mousemove')
            .pipe(takeWhile(() => dragging))
            .subscribe(mouseMoveEvent => {
                callback({ x: mouseMoveEvent.clientX - origin.x, y: mouseMoveEvent.clientY - origin.y });
                origin = Point.create(mouseMoveEvent.clientX, mouseMoveEvent.clientY);
            });
        fromEvent<MouseEvent>(document, 'mouseup')
            .pipe(first())
            .subscribe(mouseUpEvent => {
                dragging = false;
                if (dragEnd) {
                    dragEnd({
                        x: mouseUpEvent.clientX - event.clientX,
                        y: mouseUpEvent.clientY - event.clientY
                    });
                }
            });
    }
}
