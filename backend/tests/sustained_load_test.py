import os
import time
import http.client
import tempfile
from tqdm import tqdm  # Pour la barre de progression

# Config
IPFS_API_HOST = "localhost"
IPFS_API_PORT = 5001

def upload_to_ipfs(file_path):
    """Upload un fichier vers IPFS et retourne le CID"""
    with open(file_path, 'rb') as f:
        conn = http.client.HTTPConnection(IPFS_API_HOST, IPFS_API_PORT, timeout=60)
        boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
        headers = {
            'Content-Type': f'multipart/form-data; boundary={boundary}'
        }
        
        body = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="{os.path.basename(file_path)}"\r\n'
            "Content-Type: application/octet-stream\r\n\r\n"
        ).encode('utf-8')
        body += f.read()
        body += f"\r\n--{boundary}--\r\n".encode('utf-8')
        
        conn.request("POST", "/api/v0/add?pin=true", body, headers)
        response = conn.getresponse()
        
        if response.status != 200:
            raise Exception(f"Erreur IPFS: {response.read().decode()}")
        
        response_data = response.read().decode()
        cid = response_data.split('"Hash":"')[1].split('"')[0]
        return cid

def test_sustained_load(duration_minutes=10, file_size_mb=1):
    """Teste le système sous charge continue pendant X minutes"""
    print(f"\n=== Test de charge prolongée ({duration_minutes} minutes) ===")
    
    start_time = time.time()
    end_time = start_time + duration_minutes * 60
    count = 0
    
    with tqdm(total=duration_minutes * 60, desc="Charge en cours") as pbar:
        while time.time() < end_time:
            try:
                # Créer un fichier temporaire
                file_path = tempfile.mktemp()
                with open(file_path, 'wb') as f:
                    f.write(os.urandom(file_size_mb * 1024 * 1024))
                
                # Upload vers IPFS
                cid = upload_to_ipfs(file_path)
                count += 1
            except Exception as e:
                print(f"Échec à l'itération {count}: {str(e)}")
            finally:
                if os.path.exists(file_path):
                    os.remove(file_path)
            
            pbar.update(1)
    
    print(f"Succès: {count} fichiers uploadés en {duration_minutes} minutes")

if __name__ == "__main__":
    # Durée du test (en minutes) et taille des fichiers (en MB)
    test_sustained_load(duration_minutes=10, file_size_mb=1)