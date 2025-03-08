package main

import (
	"log"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"land-title-go/chaincode"
)

func main() {
	landTitleChaincode, err := contractapi.NewChaincode(&chaincode.SmartContract{})
	if err != nil {
		log.Panicf("Erreur de création du smart contract Land Title: %v", err)
	}

	if err := landTitleChaincode.Start(); err != nil {
		log.Panicf("Erreur de démarrage du smart contract: %v", err)
	}
}
