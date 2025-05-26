const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');



class Vote{
    constructor(fromVoter, toCandidate){
        this.fromVoter = fromVoter;
        this.toCandidate = toCandidate;
        this.signature = null;
    }

    calculateHash(){
        return SHA256(this.fromVoter + this.toCandidate + this.amount).toString();
    }

    signVote(signingKey){
        if(signingKey.getPublic('hex') !== this.fromVoter){
            throw new Error('You cannot sign votes for other people!');
        }

        const hashVote = this.calculateHash();
        const sig = signingKey.sign(hashVote, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromVoter === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this vote');
        }

        const publicKey = ec.keyFromPublic(this.fromVoter, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }


}

class Block{
    constructor (provinceName, timestamp, votes, previousHash = ''){
        this.provinceName = provinceName;
        this.timestamp = timestamp;
        this.votes = votes;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    

    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.votes)).toString();
    }


    hasValidVote(){
        for(const vote of this.votes){
            if(!vote.isValid()){
                return false;
            }
        }

        return true;
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.pendingVotes = [];
    }

    createGenesisBlock(){
        return new Block("Genesis", Date.now(), [], "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }



    addVote(votes, province){

        if(!votes.fromVoter|| !votes.toCandidate){
            throw new Error('The vote must include from and to address');
        }

        if(!votes.isValid()){
            throw new Error('Cannot add invalid vote to chain');
        }
        
        if(!this.pendingVotes[province]){
            this.pendingVotes[province] = [];
        }

        this.pendingVotes[province].push(votes);
    }


    finalizeProvinceVotes(provinceName){
        if (!this.pendingVotes[provinceName]) {
            throw new Error(`No pending votes for ${provinceName}`);
        }

        
        const alreadyExists = this.chain.some(block => block.provinceName === provinceName);
        if (alreadyExists) {
            throw new Error(`${provinceName} has already been finalized`);
        }
        

        const votes = this.pendingVotes[provinceName];
        let block = new Block(provinceName, Date.now(), votes, this.getLatestBlock().hash);
    
        this.chain.push(block);

        delete this.pendingVotes[provinceName];
    }

    
    getTotalVotesOfCandidate(candidateName){
        let totalVotes = 0;
        for (const block of this.chain){
            for(const vote of block.votes){
                if(vote.toCandidate === candidateName){
                totalVotes += 1;
                }
            }
        }
        return totalVotes;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidVote()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }    
}




module.exports.Blockchain = Blockchain;
module.exports.Vote = Vote;





