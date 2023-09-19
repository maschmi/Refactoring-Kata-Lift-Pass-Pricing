import express from "express";
import mysql from "mysql2/promise"

interface TicketPrice {
    cost: number;
}

interface Ticket {
    withBasePrice: (basePrice: TicketPrice) => TicketPrice
}

const zeroBasePrice = <TicketPrice>{cost: 0};

function getTicket(age: number, ticketType: string): Ticket | undefined {
    if (age < 6) {
        return {withBasePrice: () => zeroBasePrice}
    }
    if (ticketType === 'night') {
        if (age > 64) {
            return {withBasePrice: (basePrice) => ({cost: Math.ceil(basePrice.cost * .4)})}
        }
        return {withBasePrice: (basePrice) => basePrice}
    }
    return undefined;
}

export function calcTicketPrice(age: number, type: string, date: string | undefined, basePrice: TicketPrice, holidays: any[]): TicketPrice {
    const ticket = getTicket(age, type);
    if (ticket !== undefined) {
        return ticket.withBasePrice(basePrice);
    }
    if (type === 'night') {
        if (age >= 6) {
            if (age > 64) {
                return ({cost: Math.ceil(basePrice.cost * .4)})
            } else {
                return (basePrice)
            }
        } else {
            return (zeroBasePrice)
        }
    } else {
        let isHoliday;
        let reduction = 0
        for (let holiday of holidays) {
            if (date) {
                let d = new Date(date as string)
                if (d.getFullYear() === holiday.getFullYear()
                    && d.getMonth() === holiday.getMonth()
                    && d.getDate() === holiday.getDate()) {

                    isHoliday = true
                }
            }

        }

        if (!isHoliday && new Date(date as string).getDay() === 1) {
            reduction = 35
        }

        // TODO apply reduction for others
        if (age < 15) {
            return ({cost: Math.ceil(basePrice.cost * .7)})
        } else {
            if (age === undefined) {
                let cost = basePrice.cost * (1 - reduction / 100)
                return ({cost: Math.ceil(cost)})
            } else {
                if (age > 64) {
                    let cost = basePrice.cost * .75 * (1 - reduction / 100)
                    return ({cost: Math.ceil(cost)})
                } else {
                    let cost = basePrice.cost * (1 - reduction / 100)
                    return ({cost: Math.ceil(cost)})
                }
            }
        }
    }
}

async function createApp() {
    const app = express()

    let connectionOptions = {host: 'localhost', user: 'root', database: 'lift_pass', password: 'mysql'}
    const connection = await mysql.createConnection(connectionOptions)

    app.put('/prices', async (req, res) => {
        const liftPassCost = req.query.cost
        const liftPassType = req.query.type
        const [rows, fields] = await connection.query(
            'INSERT INTO `base_price` (type, cost) VALUES (?, ?) ' +
            'ON DUPLICATE KEY UPDATE cost = ?',
            [liftPassType, liftPassCost, liftPassCost]);

        res.json()
    })

    app.get('/prices', async (req, res) => {
        const type = req.query.type as unknown as string
        const date = req.query.date as unknown as string
        const age = req.query.age as unknown as number

        const getBasePrice = async () => (await connection.query(
            'SELECT cost FROM `base_price` ' +
            'WHERE `type` = ? ',
            [type]))[0][0] as unknown as TicketPrice
        const getHolidays = async () => ((await connection.query(
            'SELECT * FROM `holidays`'
        ))[0] as mysql.RowDataPacket[]).map(r => r.holiday)


        const holidays = await getHolidays()
        const basePrice = await getBasePrice()
        let calcPrice = calcTicketPrice(age, type, date, basePrice, holidays);
        res.json(calcPrice);
    })
    return {app, connection}
}

export {createApp}
