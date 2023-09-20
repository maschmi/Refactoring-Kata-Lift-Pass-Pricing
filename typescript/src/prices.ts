import express from "express";
import mysql, {Connection} from "mysql2/promise"

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
        return age > 64 ? {withBasePrice: (basePrice) => ({cost: Math.ceil(basePrice.cost * .4)})} : {withBasePrice: (basePrice) => basePrice};
    }
    return undefined;
}

function notAHoliday(holidays: Holiday[], date: Date) {
    for (let holiday of holidays) {
        if (date) {
            let d = new Date(date)
            if (d.getFullYear() === holiday.getFullYear()
                && d.getMonth() === holiday.getMonth()
                && d.getDate() === holiday.getDate()) {

                return false;
            }
        }

    }
    return true;
}

function getSomeReduction(holidays: Holiday[], date: Date) {
    let reduction = 0

    if (new Date(date).getDay() === 1 && notAHoliday(holidays, date)) {
        reduction = 35
    }
    return reduction;
}

export function calcTicketPrice(age: number, type: string, date: Date, basePrice: TicketPrice, holidays: Holiday[]): TicketPrice {
    const ticket = getTicket(age, type);
    if (ticket !== undefined) {
        return ticket.withBasePrice(basePrice);
    }

    let reduction = getSomeReduction(holidays, date);

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

async function getBasePrice(connection: Connection, type: string) {
     return await ((connection.query(
         'SELECT cost FROM `base_price` ' +
         'WHERE `type` = ? ',
         [type])).then(r => r))[0][0] as unknown as TicketPrice
}

export interface Holiday {
    getFullYear(): number,
    getMonth(): number,
    getDate(): number
}

async function getHolidays(connection: Connection) {
    return ((await connection.query(
        'SELECT * FROM `holidays`'
    ))[0] as mysql.RowDataPacket[]).map(r => r.holiday as Holiday);
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
        const date = new Date(req.query.date as unknown as string)
        const age = req.query.age as unknown as number


        const holidays = await getHolidays(connection)
        const basePrice = await getBasePrice(connection, type);
        let calcPrice = calcTicketPrice(age, type, date, basePrice, holidays);
        res.json(calcPrice);
    })
    return {app, connection}
}

export {createApp}
