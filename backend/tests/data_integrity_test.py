import os
import hashlib
import http.client

# Config
IPFS_API_HOST = "localhost"
IPFS_API_PORT = 5001

def test_data_integrity(cid, original_hash):
    """Vérifie que le fichier récupéré correspond au fichier original"""
    conn = http.client.HTTPConnection(IPFS_API_HOST, IPFS_API_PORT, timeout=60)
    conn.request("GET", f"/api/v0/cat?arg={cid}")
    response = conn.getresponse()
    
    if response.status != 200:
        raise Exception(f"Erreur IPFS: {response.read().decode()}")
    
    downloaded_data = response.read()
    downloaded_hash = hashlib.sha256(downloaded_data).hexdigest()
    
    if downloaded_hash != original_hash:
        raise Exception("Intégrité des données compromise")
    
    return True

def run_integrity_tests(test_cases):
    print("Démarrage des tests d'intégrité des données...\n")
    
    results = []
    for cid, original_hash in test_cases:
        try:
            test_data_integrity(cid, original_hash)
            results.append({
                'cid': cid,
                'integrity_check': "OK"
            })
        except Exception as e:
            results.append({
                'cid': cid,
                'integrity_check': str(e)
            })
    
    return results

def print_results(results):
    print("\nRésultats des tests d'intégrité:")
    print("{:<50} {:<20}".format('CID', 'Résultat'))
    
    for result in results:
        print("{:<50} {:<20}".format(
            result['cid'],
            result['integrity_check']
        ))

if __name__ == "__main__":
    # Liste des CIDs et leurs hashs originaux (remplacez par vos données réelles)
    test_cases = [
        ("QmXr9Q...", "abc123..."),  # CID 1 et son hash
        ("QmYt4i...", "def456..."),  # CID 2 et son hash
        ("QmP9bZ...", "ghi789...")   # CID 3 et son hash
    ]
    
    results = run_integrity_tests(test_cases)
    print_results(results)