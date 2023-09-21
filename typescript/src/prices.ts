import express from "express";
import mysql, {Connection} from "mysql2/promise"
import {RowDataPacket} from "mysql2";

async function getPrice<P, ResBody, ReqBody, ReqQuery, LocalsObj>(connection: Connection, type: string) {
    return (await connection.query(
        'SELECT cost FROM `base_price` ' +
        'WHERE `type` = ? ',
        [type]))[0][0];
}

async function someHolidays(connection: Connection) {
    const holidays = (await connection.query(
        'SELECT * FROM `holidays`'
    ))[0] as mysql.RowDataPacket[];
    return holidays;
}

function getTicket(age: string | undefined, type: string, holidays: any[], basePrice: any): any {
    if (age as any < 6) {
        return ({cost: 0})
    }
    if (type === 'night') {
            if (age as any > 64) {
                return ({cost: Math.ceil(basePrice.cost * .4)})
            } else {
                return (basePrice)
            }
    }
    return undefined;
}

export function logicForRealThisTime(age: string | undefined, type:string, holidays: RowDataPacket[], date: string | undefined, result) {
    const price = getTicket(age,type,holidays,result);
    if (price !== undefined) {
        return price;
    }


        let isHoliday;
        let reduction = 0
        for (let row of holidays) {
            let holiday = row.holiday
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
        if (age as any < 15) {
            return ({cost: Math.ceil(result.cost * .7)})
        } else {
            if (age === undefined) {
                let cost = result.cost * (1 - reduction / 100)
                return ({cost: Math.ceil(cost)})
            } else {
                if (age as any > 64) {
                    let cost = result.cost * .75 * (1 - reduction / 100)
                    return ({cost: Math.ceil(cost)})
                } else {
                    let cost = result.cost * (1 - reduction / 100)
                    return ({cost: Math.ceil(cost)})
                }
            }
        }

}

async function createApp() {
    const app = express()

    let connectionOptions = {host: 'localhost', user: 'root', database: 'lift_pass', password: 'mysql'}
    const connection = await mysql.createConnection(connectionOptions)

    app.get('/prices', async (req, res) => {
        const age = req.query.age as string;
        const type = req.query.type as string;
        const date = req.query.date as string;

        const price = await getPrice(connection, type)
        const holidays = await someHolidays(connection);

        let response: any;
        response = logicForRealThisTime(age, type, holidays, date, price);
        res.json(response);
    })
    return {app, connection}
}

export {createApp}
