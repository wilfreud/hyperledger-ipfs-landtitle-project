import os
import time
import http.client
from tqdm import tqdm  # Pour la barre de progression

# Config
IPFS_API_HOST = "localhost"
IPFS_API_PORT = 5001

def download_from_ipfs(cid):
    """Télécharge un fichier depuis IPFS et retourne le temps de téléchargement"""
    start_time = time.time()
    
    conn = http.client.HTTPConnection(IPFS_API_HOST, IPFS_API_PORT, timeout=60)
    conn.request("GET", f"/api/v0/cat?arg={cid}")
    response = conn.getresponse()
    
    if response.status != 200:
        raise Exception(f"Erreur IPFS: {response.read().decode()}")
    
    # Lire et ignorer les données (simuler le téléchargement)
    response.read()
    download_time = time.time() - start_time
    
    return download_time

def run_download_benchmark(cids):
    print("Démarrage du benchmark de téléchargement...\n")
    
    results = []
    for cid in tqdm(cids, desc="Téléchargement des fichiers"):
        try:
            download_time = download_from_ipfs(cid)
            results.append({
                'cid': cid,
                'download_time_sec': round(download_time, 2)
            })
        except Exception as e:
            results.append({
                'cid': cid,
                'error': str(e)
            })
    
    return results

def print_results(results):
    print("\nRésultats du benchmark de téléchargement:")
    print("{:<50} {:<10}".format('CID', 'Temps (s)'))
    
    for result in results:
        if 'error' in result:
            print(f"{result['cid']} - ERREUR: {result['error']}")
        else:
            print("{:<50} {:<10}".format(
                result['cid'],
                result['download_time_sec']
            ))

if __name__ == "__main__":
    # Liste des CIDs à tester (remplacez par vos CIDs réels)
    cids = [
        "QmXr9Q...",  # CID 1
        "QmYt4i...",  # CID 2
        "QmP9bZ..."   # CID 3
    ]
    
    results = run_download_benchmark(cids)
    print_results(results)