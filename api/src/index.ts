import { APP_CONFIGURATION } from './utils/config';
import express, { Response } from "express";
import morgan from 'morgan';
import accountRouter from './routes/account';
import contractRouter from "./routes/contract";
import verificationRouter from "./routes/verification";
import { getSetheumPrice } from "./services/utils";
import { errorStatus } from "./utils/utils";

const cors = require('cors');

const app = express();

// Parse incoming requests with JSON payloads
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api', contractRouter);
app.use('/api/account', accountRouter);
app.use('/api/verificator', verificationRouter);

// app.get('/api/price/setheum', async (_, res: Response) => {
//   try {
//     const price = await getSetheumPrice();
//     res.send(price);    
//   } catch (err) {
//     res.status(errorStatus(err)).send(err.message);
//   }
// });


// TODO db testing
// app.get('/api/test/erc20-contracts', async (_, res) => {
//   try {
//     const result = await query("SELECT e.contract_id, e.name, e.symbol FROM contract as c INNER JOIN erc20 as e ON c.contract_id = e.contract_id;", []);
//     res.send(result)
//   } catch (err) {
//     console.log(err);
//     res.status(errorStatus(err)).send(err.message);
//   }
// })
// app.get('/api/test/contracts', async (_, res) => {
//   try {
//     const result = await query("SELECT * FROM contract LIMIT 1;", []);
//     res.send(result)
//   } catch (err) {
//     console.log(err);
//     res.status(errorStatus(err)).send(err.message);
//   }
// })
// app.get('/api/test/token-holders', async (_, res) => {
//   try {
//     const result = await query("SELECT contract_id FROM token_holder;", []);
//     res.send(result)
//   } catch (err) {
//     console.log(err);
//     res.status(errorStatus(err)).send(err.message);
//   }
// })
// app.get('/api/test/cvr', async (_, res) => {
//   try {
//     const result = await query("SELECT * FROM contract_verification_request;", []);
//     res.send(result)
//   } catch (err) {
//     console.log(err);
//     res.status(errorStatus(err)).send(err.message);
//   }
// })

app.listen(APP_CONFIGURATION.httpPort, () => {
  console.log(`Setheum explorer API is running on port ${APP_CONFIGURATION.httpPort}.`);
});

