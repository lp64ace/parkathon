import kDTree from './lib/kdtree.js';
import parking from './lib/parking.js';

import express from "express";
import fetch from "node-fetch";

const prt = 9000;
const app = express();

app.listen(prt, () => console.log(`Backend running on port ${prt}`));
