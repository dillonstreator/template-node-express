
import express from 'express';
import { RequestListener } from 'http';
import { Config } from './config';
import pino from 'pino';
import { randomUUID } from 'crypto';
import { AsyncLocalStorage } from 'async_hooks';

export type App = {
    requestListener: RequestListener,
    shutdown: () => Promise<void>,
}

export const initApp = async (config: Config, logger: pino.Logger): Promise<App> => {
    const app = express();
    app.set("trust proxy", 1);

    app.use((req, res, next) => {
        const start = new Date().getTime();
        
        const requestId = req.headers['x-request-id']?.[0] || randomUUID();

        const l = logger.child({ requestId });

        res.on("finish", () => {
            l.info({
                duration: new Date().getTime() - start,
                method: req.method,
                path: req.path,
                status: res.statusCode,
                ua: req.headers['user-agent'],
                ip: req.ip,
            }, "Request handled");
        });

        asl.run({ logger: l, requestId }, () => next());
    });

    app.get(config.healthCheckEndpoint, (req, res) => {
        res.sendStatus(200);
    });

    app.get("/hi", (req, res) => {
        const s = asl.getStore();
        s?.logger.info("hi");
        res.send("hi");
    });

    return {
        requestListener: app,
        shutdown: async () => {
            // add any cleanup code here including database/redis disconnecting and background job shutdown
        },
    }
}

type Store = {
    logger: pino.Logger;
    requestId: string;
    // traceId: string;
}

const asl = new AsyncLocalStorage<Store>();
