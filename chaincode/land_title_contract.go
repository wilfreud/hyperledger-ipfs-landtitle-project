package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// LandTitle définit un titre foncier stocké sur la blockchain
type LandTitle struct {
	ID                  string  `json:"ID"`
	Owner               string  `json:"Owner"`
	PropertyDescription string  `json:"PropertyDescription"`
	PropertyValue       float64 `json:"PropertyValue"`
	DocumentHash        string  `json:"DocumentHash"` // CID IPFS
	Timestamp           string  `json:"Timestamp"`
	Organization        string  `json:"Organization"` // Organisation propriétaire (MSP)
}

// SmartContract définit les fonctions disponibles sur le chaincode
type SmartContract struct {
	contractapi.Contract
}

// InitLedger initialise la blockchain avec des titres fonciers fictifs
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	titles := []LandTitle{
		{ID: "1", Owner: "Alice", PropertyDescription: "Villa bord de mer", PropertyValue: 500000, DocumentHash: "Qm123", Timestamp: "2025-02-21", Organization: "Org1MSP"},
		{ID: "2", Owner: "Bob", PropertyDescription: "Appartement centre-ville", PropertyValue: 250000, DocumentHash: "Qm456", Timestamp: "2025-02-21", Organization: "Org2MSP"},
	}

	for _, title := range titles {
		if err := s.saveLandTitle(ctx, title); err != nil {
			return err
		}
	}
	return nil
}

// CreateLandTitle crée un nouveau titre foncier
func (s *SmartContract) CreateLandTitle(ctx contractapi.TransactionContextInterface, id, owner, desc string, value float64, timestamp string, cid string) error {
	// Récupération de l'organisation (MSP) du client appelant
	mspID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("erreur lors de la récupération de l'organisation : %v", err)
	}

	// Vérifier si l'ID existe déjà
	exists, err := s.LandTitleExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("le titre foncier %s existe déjà", id)
	}

	// Création de l'objet titre foncier
	title := LandTitle{
		ID:                  id,
		Owner:               owner,
		PropertyDescription: desc,
		PropertyValue:       value,
		DocumentHash:        cid,
		Timestamp:           timestamp,
		Organization:        mspID,
	}

	return s.saveLandTitle(ctx, title)
}

// ReadLandTitle récupère un titre foncier
func (s *SmartContract) ReadLandTitle(ctx contractapi.TransactionContextInterface, id string) (*LandTitle, error) {
	titleJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("échec de la lecture : %v", err)
	}
	if titleJSON == nil {
		return nil, fmt.Errorf("le titre foncier %s n'existe pas", id)
	}

	var title LandTitle
	if err := json.Unmarshal(titleJSON, &title); err != nil {
		return nil, fmt.Errorf("échec de désérialisation du titre foncier : %v", err)
	}
	return &title, nil
}

// UpdateLandTitle met à jour un titre foncier (seulement par l'organisation propriétaire)
func (s *SmartContract) UpdateLandTitle(ctx contractapi.TransactionContextInterface, id, newOwner string, newValue float64) error {
	title, err := s.ReadLandTitle(ctx, id)
	if err != nil {
		return err
	}

	// Vérifier si l'appelant est autorisé
	if err := CheckCallerMSP(ctx, title.Organization); err != nil {
		return err
	}

	// Mise à jour des données
	title.Owner = newOwner
	title.PropertyValue = newValue

	return s.saveLandTitle(ctx, *title)
}

// TransferLandTitle transfère un titre foncier à une nouvelle organisation
func (s *SmartContract) TransferLandTitle(ctx contractapi.TransactionContextInterface, id, newOwner, newOrg string) error {
	// Lire le titre foncier
	title, err := s.ReadLandTitle(ctx, id)
	if err != nil {
		return err
	}

	// Vérifier que l'organisation appelante est bien celle qui possède le titre
	if err := CheckCallerMSP(ctx, title.Organization); err != nil {
		return err
	}

	// Mise à jour du propriétaire et de l'organisation
	title.Owner = newOwner
	title.Organization = newOrg

	return s.saveLandTitle(ctx, *title)
}

// GetAllLandTitles retourne tous les titres fonciers stockés dans la blockchain
func (s *SmartContract) GetAllLandTitles(ctx contractapi.TransactionContextInterface) ([]LandTitle, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf("échec de récupération des titres fonciers : %v", err)
	}
	defer resultsIterator.Close()

	var titles []LandTitle
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("erreur lors de la lecture des résultats : %v", err)
		}

		var title LandTitle
		if err := json.Unmarshal(queryResponse.Value, &title); err != nil {
			return nil, fmt.Errorf("échec de désérialisation du titre foncier : %v", err)
		}
		titles = append(titles, title)
	}

	return titles, nil
}

// LandTitleExists vérifie si un titre foncier existe
func (s *SmartContract) LandTitleExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	titleJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("échec de la lecture : %v", err)
	}
	return titleJSON != nil, nil
}


// CheckCallerMSP vérifie si l'organisation appelante correspond à l'organisation attendue
func CheckCallerMSP(ctx contractapi.TransactionContextInterface, expectedMSP string) error {
	mspID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("erreur de récupération de l'organisation appelante : %v", err)
	}
	if mspID != expectedMSP {
		return fmt.Errorf("opération refusée : seule l'organisation %s peut effectuer cette action", expectedMSP)
	}
	return nil
}

// saveLandTitle enregistre un titre foncier sur la blockchain
func (s *SmartContract) saveLandTitle(ctx contractapi.TransactionContextInterface, title LandTitle) error {
	titleJSON, err := json.Marshal(title)
	if err != nil {
		return fmt.Errorf("échec de la sérialisation du titre foncier : %v", err)
	}
	return ctx.GetStub().PutState(title.ID, titleJSON)
}
