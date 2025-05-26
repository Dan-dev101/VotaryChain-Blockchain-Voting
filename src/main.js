const {Blockchain, Vote} = require('./blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myVoterKey = ec.keyFromPrivate('3d439b5e4ae34e45ae621c23b345fbd7be33ba874cdd283f8bd1351fe2e88cab')
const myVoterID = myVoterKey.getPublic('hex');

const vote = new Vote(myVoterID, "Candidate A");
vote.signVote(myVoterKey);

const election = new Blockchain();
election.addVote(vote, "Ontario");

election.finalizeProvinceVotes("Ontario");

console.log("Total votes for Candidate A:", election.getTotalVotesOfCandidate("Candidate A"));

console.log(JSON.stringify(election, null, 4));

election.chain[1].votes[0].toCandidate = "Candidate B";

console.log('Is chain valid?', election.isChainValid());