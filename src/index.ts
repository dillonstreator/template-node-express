import { otlpShutdown } from "./telemetry";
import { createServer } from "node:http";
import gracefulShutdown from "http-graceful-shutdown";
import { initApp } from "./app";
import { Env, initConfig } from "./config";
import { initLogging } from "./logging";

const main = async () => {
    const config = await initConfig();
    const logger = await initLogging(config);
    const app = await initApp(config, logger);
    const server = createServer(app.requestListener)
        .listen(config.port, () => logger.info(`HTTP server listening on port ${config.port}`));

    gracefulShutdown(server, {
        timeout: config.shutdownTimeoutMs,
        development: config.env !== Env.Prod,
        preShutdown: async (signal) => {
            logger.info({ signal }, "Shutdown signal received");
        },
        onShutdown: async () => {
            await app.shutdown();
            await otlpShutdown();
        },
        finally: () => {
            logger.info("Shutdown complete");
        },
    });
}

main();