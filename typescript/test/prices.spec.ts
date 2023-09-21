import {assert, expect} from 'chai';
import request from 'supertest-as-promised';
import {createApp, logicForRealThisTime} from "../src/prices"

describe('prices', () => {

    it("testStuffAtNight", () => {
        const result = logicForRealThisTime("5","night", [], undefined, {})
        expect(result).deep.eq({cost: 0})
    })


    it("testStuffAtDay", () => {
        const result = logicForRealThisTime("5","day", [], undefined, {})
        expect(result).deep.eq({cost: 0})
    })
});
