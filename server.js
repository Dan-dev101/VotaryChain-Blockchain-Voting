const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const voteRoutes = require('./src/routes/voteRoutes'); 
const { Blockchain } = require('./src/blockchain');
const PORT = 8080;

const votingBlockchain = new Blockchain();

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.blockchain = votingBlockchain;
    next();
});

app.use('/api', voteRoutes);


app.listen(
    PORT,
    () => console.log(`Server live on http://localhost:${PORT}`)
)