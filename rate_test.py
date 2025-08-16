#!/usr/bin/env python3
import requests
import time
import concurrent.futures
from collections import Counter
from datetime import datetime

def make_request(url, session, request_num):
    start_time = time.time()
    try:
        response = session.get(url, timeout=5)
        status = response.status_code
    except requests.exceptions.RequestException as e:
        status = f"Error: {str(e)}"
    
    duration = time.time() - start_time
    timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    
    return {
        "request_num": request_num,
        "status": status,
        "duration": duration,
        "timestamp": timestamp
    }

def run_test(url, num_requests, concurrency):
    print(f"Testing rate limiting on {url}")
    print(f"Sending {num_requests} requests with concurrency of {concurrency}")
    print("=" * 60)
    
    results = []
    session = requests.Session()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
        futures = [
            executor.submit(make_request, url, session, i+1) 
            for i in range(num_requests)
        ]
        
        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            results.append(result)
            
            print(f"[{result['timestamp']}] Request {result['request_num']}: "
                  f"Status {result['status']} - {result['duration']:.3f}s")
    
    statuses = Counter([r["status"] for r in results])
    print("\n" + "=" * 60)
    print("Results Summary:")
    for status, count in statuses.items():
        status_name = "Rate Limited" if status == 429 else (
                      "Success" if status == 200 else "Other")
        print(f"  {status} ({status_name}): {count} requests")
    
    return results

if __name__ == "__main__":
    url = "http://whatsmylines.com"
    num_requests = 30000
    concurrency = 15
    
    run_test(url, num_requests, concurrency)
