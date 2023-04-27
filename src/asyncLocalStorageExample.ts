import http from "http";
import {AsyncLocalStorage} from "async_hooks";

function resolveAfter3Seconds(x: number) : Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(x);
        }, 3000);
    });
}


export const passParametersThroughCallbacks = () => {
    const doMoreAsyncWork = async (reqId: number) => {
        console.log(`Doing more async work of request: ${reqId}`)
        return await resolveAfter3Seconds(10);
    }

    const doAsyncWork = async (reqId: number) => {
        console.log(`Doing async work of request: ${reqId}`)
        const x = await resolveAfter3Seconds(10);
        const y = await doMoreAsyncWork(reqId);
        return x + y;
    }

    let requestId = 0;
    http.createServer( async () => {
        requestId = requestId + 1;
        const result = await doAsyncWork(requestId);
        console.log(result);
    }).listen(8080);

}

export const passParametersViaAsyncStorage = () => {
    type MyStoreType = {
        reqId: number;
    }
    // This class creates stores that stay coherent through asynchronous operations.
    const asyncLocalStorage = new AsyncLocalStorage<MyStoreType>();


    const doMoreAsyncWork = async () => {
        const store = asyncLocalStorage.getStore();
        if (store) {
            console.log(`Doing more async work of request: ${store.reqId}`)
        }
        return await resolveAfter3Seconds(10);
    }

    const doAsyncWork = async () => {
        const store = asyncLocalStorage.getStore();
        if (store) {
            console.log(`Doing async work of request: ${store.reqId}`)
        }
        const x = await resolveAfter3Seconds(10);
        const y = await doMoreAsyncWork();
        return x + y;
    }

    let requestId = 0;
    http.createServer( async () => {
        requestId = requestId + 1;
        const store: MyStoreType = {
            reqId: requestId
        }
        const result = await asyncLocalStorage.run(store, () => doAsyncWork());
        console.log(result);
    }).listen(8080);

}