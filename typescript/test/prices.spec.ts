import {assert, expect} from 'chai';
import {createApp, calcTicketPrice, Holiday} from "../src/prices"

describe('prices', () => {

    it("returns something age 5", () => {
        const calcPrice = calcTicketPrice(5, "day", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 0})
    })

    it("returns something age 6", () => {
        const calcPrice = calcTicketPrice(6, "day", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 70})
    })

    it("returns something age 5 night", () => {
        const calcPrice = calcTicketPrice(5, "night", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 0})
    })

    it("returns something age 6 night", () => {
        const calcPrice = calcTicketPrice(6, "night", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 100})
    })

    it("returns something age 14", () => {
        const calcPrice = calcTicketPrice(14, "day", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 70})
    })

    it("returns something age 14 night", () => {
        const calcPrice = calcTicketPrice(14, "night", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 100})
    })

    it("returns something age 15", () => {
        const calcPrice = calcTicketPrice(15, "day", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 100})
    })

    it("returns something age 15 night", () => {
        const calcPrice = calcTicketPrice(15, "night", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 100})
    })

    it("returns something age 64", () => {
        const calcPrice = calcTicketPrice(64, "day", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 100})
    })

    it("returns something age 64 night", () => {
        const calcPrice = calcTicketPrice(64, "night", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 100})
    })

    it("returns something age 65", () => {
        const calcPrice = calcTicketPrice(65, "day", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 75})
    })

    it("returns something age 65 night", () => {
        const calcPrice = calcTicketPrice(65, "night", new Date('2023-09-19'), ({cost: 100}), [])
        expect(calcPrice).deep.equals({cost: 40})
    })


    describe("reductions when ", () => {
        interface TestCase {
            testCase: string,
            date: Date,
            type: string,
            age: number,
            expectedPrice: number
        }

        // a week of holidays
        const holidays: Holiday[] = [
            new Date('2023-09-18'),
            new Date('2023-09-19'),
            new Date('2023-09-20'),
            new Date('2023-09-21'),
            new Date('2023-09-22'),
            new Date('2023-09-23'),
            new Date('2023-09-24'),
        ];
        const basePrice = ({cost: 100})

        const testCases: TestCase[] = [
            {testCase: 'Holiday on Monday', date: new Date('2023-09-18'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Holiday on Tuesday', date: new Date('2023-09-19'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Holiday on Wednesday', date: new Date('2023-09-20'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Holiday on Thursday', date: new Date('2023-09-21'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Holiday on Friday', date: new Date('2023-09-22'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Holiday on Saturday', date: new Date('2023-09-23'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Holiday on Sunday', date: new Date('2023-09-24'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Normal day on Monday', date: new Date('2023-10-09'), type: 'day', age: 35, expectedPrice: 65},
            {testCase: 'Normal day on Tuesday', date: new Date('2023-10-10'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Normal day on Wednesday', date: new Date('2023-10-11'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Normal day on Thursday', date: new Date('2023-10-12'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Normal day on Friday', date: new Date('2023-10-13'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Normal day on Saturday', date: new Date('2023-10-14'), type: 'day', age: 35, expectedPrice: 100},
            {testCase: 'Normal day on Sunday', date: new Date('2023-10-15'), type: 'day', age: 35, expectedPrice: 100}
        ];

        type PriceFunction = (testCaseName: string) => number

        const testCaseGeneration = (age: number, expectedPriceFunction: PriceFunction) => testCases.map(tc => ({...tc, age: age, expectedPrice: expectedPriceFunction(tc.testCase)}))

        describe("age is 14 and ", () => {
            testCaseGeneration(14, () => 70).forEach(tc => {
                it(`${tc.testCase} and age is ${tc.age}`, () => {
                    const calcPrice = calcTicketPrice(tc.age, tc.type, tc.date, basePrice, holidays)
                    expect(calcPrice).deep.equals({cost: tc.expectedPrice})
                })
            })
        })

        describe("age is 15 and ", () => {
            testCaseGeneration(15, testcaseName => testcaseName === 'Normal day on Monday' ? 65 : 100).forEach(tc => {
                it(`${tc.testCase} and age is ${tc.age}`, () => {
                    const calcPrice = calcTicketPrice(tc.age, tc.type, tc.date, basePrice, holidays)
                    expect(calcPrice).deep.equals({cost: tc.expectedPrice})
                })
            })
        })

        describe("age is 35 and ", () => {
            testCases.forEach(tc => {
                it(`${tc.testCase} and age is ${tc.age}`, () => {
                    const calcPrice = calcTicketPrice(tc.age, tc.type, tc.date, basePrice, holidays)
                    expect(calcPrice).deep.equals({cost: tc.expectedPrice})
                })
            })
        })

        describe("age is 64 and ", () => {
            testCaseGeneration(64, testcaseName => testcaseName === 'Normal day on Monday' ? 65 : 100).forEach(tc => {
                it(`${tc.testCase} and age is ${tc.age}`, () => {
                    const calcPrice = calcTicketPrice(tc.age, tc.type, tc.date, basePrice, holidays)
                    expect(calcPrice).deep.equals({cost: tc.expectedPrice})
                })
            })
        })

        describe("age is 65 and ", () => {
            testCaseGeneration(65, testcaseName => testcaseName === 'Normal day on Monday' ? 49 : 75 ).forEach(tc => {
                it(`${tc.testCase} and age is ${tc.age}`, () => {
                    const calcPrice = calcTicketPrice(tc.age, tc.type, tc.date, basePrice, holidays)
                    expect(calcPrice).deep.equals({cost: tc.expectedPrice})
                })
            })
        })

    })

});
