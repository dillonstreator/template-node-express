import pino from 'pino';
import request from 'supertest';
import { App, initApp } from './app';
import { Config, initConfig } from './config';
import fetchMock from 'fetch-mock';

describe('app', () => {
    let app: App;
    let config: Config;
    beforeAll(async () => {
        config = {
            ...(await initConfig()),
            healthCheckEndpoint: '/some-health-check-endpoint',
        };
        app = await initApp(config, pino({ enabled: false }));
    });
    afterAll(async () => {
        await app?.shutdown();
    });
    afterEach(() => {
        fetchMock.restore();
    });

    it('should return 200 for config health check endpoint', async () => {
        await request(app.requestListener)
            .get(config.healthCheckEndpoint)
            .expect(200);
    });

    it('should respond properly to hi', async () => {
        await request(app.requestListener).get('/hi').expect(200).expect('hi');
    });

    it('should mock fetch', async () => {
        const fetchURL = 'https://jsonplaceholder.typicode.com/users';
        const users = [{ name: 'user1' }, { name: 'user2' }];
        fetchMock.get(fetchURL, users);

        await request(app.requestListener)
            .get('/abort-signal-propagation')
            .expect(200)
            .expect((res) => {
                res.body == users;
            });

        expect(fetchMock.called(fetchURL)).toBe(true);
    });

    // TODO: look into fixing this test as it seemingly always passes even if explicitly making /abort-signal-propagation not respect the abort signal
    // manual testing did confirm the implementation is working properly so something goofy about supertest#abort()
    it('should propagate cancellation and not fetch', async () => {
        const fetchURL = 'https://jsonplaceholder.typicode.com/users';
        const users = [{ name: 'user1' }, { name: 'user2' }];
        fetchMock.get(fetchURL, users);

        try {
            await request(app.requestListener)
                .get('/abort-signal-propagation')
                .abort(); // abort() throws so make sure to catch it
        } catch (e) {}

        // allow the server to complete any work that it would have been doing before asserting that fetch did not get called
        await new Promise((r) => setTimeout(r, 500));

        expect(fetchMock.called(fetchURL)).toBe(false);
    });
});
