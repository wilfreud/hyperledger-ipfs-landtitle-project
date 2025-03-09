import os
import time
import http.client
import tempfile
import subprocess
from tqdm import tqdm  # Pour la barre de progression

# Config
DOCKER_CONTAINER_NAME = "ipfs_host"  # Nom du container Docker
IPFS_API_HOST = "localhost"
IPFS_API_PORT = 5001
FILE_SIZES = [
    1 * 1024 * 1024,       # 1 MB
    10 * 1024 * 1024,      # 10 MB
    100 * 1024 * 1024,     # 100 MB
    1 * 1024 * 1024 * 1024, # 1 GB
    2 * 1024 * 1024 * 1024  # 5 GB
]
RESULTS = []

def check_docker_container():
    """Vérifie si le container IPFS est en cours d'exécution"""
    try:
        result = subprocess.run(
            ["docker", "ps", "--filter", f"name={DOCKER_CONTAINER_NAME}", "--format", "{{.Names}}"],
            capture_output=True, text=True
        )
        return DOCKER_CONTAINER_NAME in result.stdout
    except Exception as e:
        print(f"Erreur lors de la vérification du container Docker: {e}")
        return False

def generate_temp_file(size):
    """Crée un fichier temporaire avec des données aléatoires"""
    with tempfile.NamedTemporaryFile(delete=False) as f:
        f.write(os.urandom(size))
        return f.name

def upload_to_ipfs(file_path):
    """Upload un fichier vers IPFS et retourne le CID et le temps d'upload"""
    start_time = time.time()
    
    with open(file_path, 'rb') as f:
        # Créer une connexion HTTP
        conn = http.client.HTTPConnection(IPFS_API_HOST, IPFS_API_PORT, timeout=60)
        
        # Préparer les headers et le body
        boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
        headers = {
            'Content-Type': f'multipart/form-data; boundary={boundary}'
        }
        
        # Construire le corps de la requête
        body = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="{os.path.basename(file_path)}"\r\n'
            "Content-Type: application/octet-stream\r\n\r\n"
        ).encode('utf-8')
        body += f.read()
        body += f"\r\n--{boundary}--\r\n".encode('utf-8')
        
        # Envoyer la requête
        conn.request("POST", "/api/v0/add?pin=true", body, headers)
        response = conn.getresponse()
        
        if response.status != 200:
            raise Exception(f"Erreur IPFS: {response.read().decode()}")
        
        # Extraire le CID de la réponse
        response_data = response.read().decode()
        cid = response_data.split('"Hash":"')[1].split('"')[0]
        upload_time = time.time() - start_time
    
    return cid, upload_time

def run_benchmark():
    print("Démarrage du benchmark IPFS...\n")
    
    # Vérifier que le container est en cours d'exécution
    if not check_docker_container():
        print(f"Erreur: Le container Docker '{DOCKER_CONTAINER_NAME}' n'est pas en cours d'exécution.")
        return
    
    for size in FILE_SIZES:
        # Génération du fichier
        file_size_mb = size // (1024 * 1024)
        print(f"Création fichier {file_size_mb}MB...")
        file_path = generate_temp_file(size)
        
        # Test d'upload
        try:
            print(f"Upload {file_size_mb}MB...")
            cid, duration = upload_to_ipfs(file_path)
            
            # Enregistrement résultats
            RESULTS.append({
                'size_mb': file_size_mb,
                'cid': cid,
                'time_sec': round(duration, 2),
                'speed_mb_s': round(file_size_mb / duration, 2)
            })
            
        except Exception as e:
            print(f"Échec: {str(e)}")
            RESULTS.append({
                'size_mb': file_size_mb,
                'error': str(e)
            })
        
        # Nettoyage
        os.remove(file_path)
        print("---")

def print_results():
    print("\nRésultats du benchmark:")
    print("{:<10} {:<50} {:<10} {:<10}".format(
        'Taille (MB)', 'CID', 'Temps (s)', 'Débit (MB/s)'))
    
    for result in RESULTS:
        if 'error' in result:
            print(f"{result['size_mb']}MB - ERREUR: {result['error']}")
        else:
            print("{:<10} {:<50} {:<10} {:<10}".format(
                result['size_mb'],
                result['cid'],
                result['time_sec'],
                result['speed_mb_s']
            ))

if __name__ == "__main__":
    # Installation des dépendances si nécessaire
    # pip install tqdm
    
    try:
        run_benchmark()
        print_results()
        
        # Sauvegarde CSV
        with open('ipfs_benchmark.csv', 'w') as f:
            f.write("size_mb,cid,time_sec,speed_mb_s\n")
            for r in RESULTS:
                if 'cid' in r:
                    f.write(f"{r['size_mb']},{r['cid']},{r['time_sec']},{r['speed_mb_s']}\n")
        
        print("\nRésultats sauvegardés dans ipfs_benchmark.csv")
        
    except KeyboardInterrupt:
        print("\nBenchmark interrompu")