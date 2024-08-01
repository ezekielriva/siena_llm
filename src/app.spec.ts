import {describe, test} from '@jest/globals';
import request from 'supertest';
import app from './app';

describe("App", () => {
    test("Home", async () => {
        await request(app).get("/").expect(200)
    })
})
