// // https://stackoverflow.com/a/21947851
//
// function noOp() {};
//
// export function Cleanup(callback: { (): void; (...args: any[]): void; }) {
//
//     // attach user callback to the process event emitter
//     // if no callback, it will still exit gracefully on Ctrl-C
//     callback = callback || noOp;
//     Deno.Process.on('cleanup',callback);
//     Deno.Process.
//
//     // do app specific cleaning before exiting
//     Deno.Process.on('exit', function () {
//         // @ts-expect-error Custom defined function
//         Deno.Process.emit('cleanup');
//     });
//
//     // catch ctrl+c event and exit normally
//     Deno.Process.on('SIGINT', function () {
//         console.log('Ctrl-C...');
//         Deno.Process.exit(2);
//     });
//
//     //catch uncaught exceptions, trace, then exit normally
//     Deno.Process.on('uncaughtException', function(e) {
//         console.log('Uncaught Exception...');
//         console.log(e.stack);
//         Deno.Process.exit(99);
//     });
// }