// https://stackoverflow.com/a/21947851

function noOp() {};

export function Cleanup(callback: { (): void; (...args: any[]): void; }) {

    // attach user callback to the process event emitter
    // if no callback, it will still exit gracefully on Ctrl-C
    callback = callback || noOp;
    process.on('cleanup',callback);

    // do app specific cleaning before exiting
    process.on('exit', function () {
        // @ts-expect-error Custom defined function
        process.emit('cleanup');
    });

    // catch ctrl+c event and exit normally
    process.on('SIGINT', function () {
        console.log('Ctrl-C...');
        process.exit(2);
    });

    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', function(e) {
        console.log('Uncaught Exception...');
        console.log(e.stack);
        process.exit(99);
    });
}