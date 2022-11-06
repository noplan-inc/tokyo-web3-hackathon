import fs from 'fs';
import axios from 'axios';
import https from 'https';
import express from 'express';
import consumers from 'stream/consumers';

const app = express();

const macaroon = fs.readFileSync('./admin.macaroon').toString('hex');

const myNode = axios.create({
    baseURL: 'https://127.0.0.1:8282',
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        cert: fs.readFileSync("./tls.cert")
    }),
    headers: { 'Grpc-Metadata-macaroon': macaroon }
})



const getInfo = async () => {
    try {
        let res = await myNode.get('/v1/getinfo')
        console.log(res.status)
        return res
    } catch (err: any) {
        console.error('error')
        console.error(err);
        console.error(err.repsonse)
    }
}

const getBalance = async () => {
    try {
        let res = await myNode.get('/v1/balance/channels')
        return res.data
    } catch (err: any) {
        console.error('error')
        console.error(err);
        console.error(err.repsonse)
    }
}

const payInvoice2 = async (invoice: string): Promise<string> => {
    try {
        const res = await myNode.post('/v2/router/send', {
            payment_request: invoice,
            timeout_seconds: 60,
            fee_limit_sat: 100
        }, {
            responseType: 'stream'
        })

        return Promise.resolve((await consumers.buffer(res.data)).toString())
    } catch (err: any) {
        console.error(err.response)
        throw err
    }
}

const run = async () => {
    console.log('start')
    const res = await getInfo()
    console.log(res?.data)
}

run().catch(err => console.error)


app.listen(8787, () => {
    console.log('server started');
})

app.get('/pay', async (req, res) => {
    const invoice = req.query.invoice as string;
    if (!invoice) {
        res.json({
            "error": "invoice required",
            "data": JSON.stringify(req.query)
        })
        return;
    }
    console.log(`invoice: ${invoice}`);
    try {
        const result = await payInvoice2(invoice);
        res.json({ "ok": JSON.parse(result.split('\n')[2]) })
    } catch (err: any) {
        res.json({ "error": err.toString() }).status(400)
    }

})

app.get('/balance', async (_, res) => {
    const result = await getBalance();
    console.log(`result: ${JSON.stringify(result)}`);

    res.json({ "ok": result })
})

app.get('/', async (_, res) => {
    res.send('<html><ul><li><a href="/pay?invoice=">test wallet</a></li><li><a href="/balance">bab balance</a></li></ul></html>')
})