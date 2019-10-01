import {
    fromEvent
} from 'rxjs';
import {
    debounceTime,
} from 'rxjs/operators';

const scrollEvent = fromEvent(window, 'resize');
export const windowResizeSuscribe = (callback) => {
    return scrollEvent
        .pipe(
            debounceTime(1500)
        ).subscribe(() => {
            callback();
        });
}
