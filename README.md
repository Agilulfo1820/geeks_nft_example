# About

Smart contract creato per avere una Dapp che permetta di mintare una collezione di 20 NFT generati proceduralmente.

L'utente deve poter mintare fino ad un massimo di 5 NFT alla volta e solamanete quando la public sale è attiva.
Gli NFT hanno un costo che deve poter essere settato dall'admin, cosi come il momento in cui la vendita può essere attiva o no.

L'admin deve poter settare un prezzo per questi NFT e l'utente deve pagare quanto richiesto. L'admin deve poi poter fare il withdraw degli incassi.

Per evitare che gli utenti possano "indovinare" gli NFT più rari e per evitare che sui vari marketplace secondari si crei una discrepanza di prezzo prima che tutti gli NFT vengano mintati verrà utilizzato un il procedimento del "unveiling": ovvero scoprire tutti gli NFT insieme solamente quando si è andati in SOLD OUT (o quando lo decide l'admin).

# Requisiti
NodeJs v17.1.0
NPM v8.11.0

# Istruzioni

Installare dipendenze

```
npm install -g ganache-cli
npm install -g truffle
npm install
```

Copia .env.example e rinominiamo il file in .env (aggiungendo la private key).

Per compilare usare comando `truffle compile`.

Per eseguire i test usare il comando `truffle test`.

Per deployare lo smart contract usare il comando `truffle migrate --reset --network {networkName}` sostituendo l'ambiente desiderato a posto di `goerli`.

Per verificare lo smart contract su Etherscan usare il comando `truffle run verify {ContractName} --network {networkName}`.

# Deployed addresses
[0x35a689cecc6023ce8a89df04F5e40D86462b8783] (https://polygonscan.com/address/0x35a689cecc6023ce8a89df04F5e40D86462b8783)