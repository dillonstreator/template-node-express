
import pino from 'pino';
import request from 'supertest';
import { App, initApp } from './app';
import { Config, initConfig } from './config';

describe("app", () => {
    let app: App;
    let config: Config;
    beforeAll(async () => {
        config = {
            ...(await initConfig()),
            healthCheckEndpoint: "/some-health-check-endpoint"
        };
        app = await initApp(config, pino({ enabled: false }));
    });
    afterAll(async () => {
        await app?.shutdown();
    });

    it("should return 200 for config health check endpoint", async () => {
        await request(app.requestListener)
            .get(config.healthCheckEndpoint)
            .expect(200);
    });

    it("should respond properly to hi", async () => {
        await request(app.requestListener)
            .get("/hi")
            .expect(200)
            .expect("hi");
    });
})