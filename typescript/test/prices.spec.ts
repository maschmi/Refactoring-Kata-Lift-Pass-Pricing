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

    it("nightOlder5", () => {
        const result = logicForRealThisTime("6","night", [], undefined, {cost: 100})
        expect(result).deep.eq({cost: 100})
    })

    it("night64", () => {
        const result = logicForRealThisTime("64","night", [], undefined, {cost: 100})
        expect(result).deep.eq({cost: 100})
    })

    it("night65", () => {
        const result = logicForRealThisTime("65","night", [], undefined, {cost: 100})
        expect(result).deep.eq({cost: 40})
    })
});
