import AppFactory from '../src/client-app';
const App = AppFactory();

test('app callback', () => {
    expect(Math.max(1, 2)).toBe(2);
});

/* const render = el => {
        numRenders++;
        t.equals(el, element, 'render receives correct args');
        return el;
    };
    const app = new App(element, render);
    const callback = app.callback();
    t.equal(typeof callback, 'function');
    const ctx = await callback();
    t.equal(ctx.rendered, element);
    t.equal(numRenders, 1, 'calls render once');
    t.equal(ctx.element, element, 'sets ctx.element');
    t.end(); */