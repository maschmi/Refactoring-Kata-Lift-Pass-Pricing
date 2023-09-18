import {assert, expect} from 'chai';
import request from 'supertest-as-promised';
import {createApp, calcBasePrice} from "../src/prices"

describe('prices', () => {

    it("returns something age 5", () => {
        const calcPrice = calcBasePrice(5, "day", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 0})
    })

    it("returns something age 6", () => {
        const calcPrice = calcBasePrice(6, "day", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 7})
    })

    it("returns something age 5 night", () => {
        const calcPrice = calcBasePrice(5, "night", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 0})
    })

    it("returns something age 6 night", () => {
        const calcPrice = calcBasePrice(6, "night", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 10})
    })

    it("returns something age 14", () => {
        const calcPrice = calcBasePrice(14, "day", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 7})
    })

    it("returns something age 14 night", () => {
        const calcPrice = calcBasePrice(14, "night", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 10})
    })

    it("returns something age 15", () => {
        const calcPrice = calcBasePrice(15, "day", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 10})
    })

    it("returns something age 15 night", () => {
        const calcPrice = calcBasePrice(15, "night", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 10})
    })

    it("returns something age 64", () => {
        const calcPrice = calcBasePrice(64, "day", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 10})
    })

    it("returns something age 64 night", () => {
        const calcPrice = calcBasePrice(64, "night", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 10})
    })

    it("returns something age 65", () => {
        const calcPrice = calcBasePrice(65, "day", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 8})
    })

    it("returns something age 65 night", () => {
        const calcPrice = calcBasePrice(65, "night", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 4})
    })

});
