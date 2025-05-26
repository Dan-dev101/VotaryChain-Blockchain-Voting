const router = require('express').Router();
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { Vote } = require('../blockchain');
const generateKeyPair = require('../voterKeyGenerator');


router.post('/vote', (req, res) => {
    const { fromVoter, toCandidate, privateKey, Province } = req.body;

    try {
        const key = ec.keyFromPrivate(privateKey, 'hex');
        const vote = new Vote(fromVoter, toCandidate);
        vote.signVote(key);

        req.blockchain.addVote(vote, Province);

        res.json({ message: 'Vote successfully cast!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/finalize', (req, res) => {
    const { province } = req.body;

    try {
        req.blockchain.finalizeProvinceVotes(province);
        res.json({ message: `Finalized votes for ${province}` });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/generate-key', (req, res) => {
    const keys = generateKeyPair();
    res.json(keys);
});

router.get('/results', (req, res) => {
    const results = {
        "Justin Trudeau": req.blockchain.getTotalVotesOfCandidate("Justin Trudeau"),
        "Pierre Poilievre": req.blockchain.getTotalVotesOfCandidate("Pierre Poilievre"),
        "Jagmeet Singh": req.blockchain.getTotalVotesOfCandidate("Jagmeet Singh"),
        "Yves-François Blanchet": req.blockchain.getTotalVotesOfCandidate("Yves-François Blanchet"),
        "Elizabeth May": req.blockchain.getTotalVotesOfCandidate("Elizabeth May")
    };

    res.json(results);
});


router.get('/verify', (req, res) => {
    const isValid = req.blockchain.isChainValid();
    res.json({ valid: isValid });
});

router.get('/chain', (req, res) => {
    res.json(req.blockchain.chain);
});

module.exports = router;