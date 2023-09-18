import {assert, expect} from 'chai';
import request from 'supertest-as-promised';
import {createApp, doSomething} from "../src/prices"

describe('prices', () => {

    it("returns something", () => {
        const calcPrice = doSomething(0, "", "", ({cost: 10}), [])
        expect(calcPrice).deep.equals({cost: 0})
    })

});
