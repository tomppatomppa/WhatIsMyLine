#!/usr/bin/env python3
import requests
import time
import concurrent.futures
import argparse
from collections import Counter
from datetime import datetime

def make_request(url, session, request_num):
    """Make a request and return the status code with timing info"""
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
    """Run a load test with specified concurrency"""
    print(f"Testing rate limiting on {url}")
    print(f"Sending {num_requests} requests with concurrency of {concurrency}")
    print("=" * 60)
    
    results = []
    session = requests.Session()
    
    # Use a thread pool to send concurrent requests
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
        futures = [
            executor.submit(make_request, url, session, i+1) 
            for i in range(num_requests)
        ]
        
        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            results.append(result)
            
            status = result["status"]
            if status == 429:
                status_str = f"\033[91m{status}\033[0m"  # Red color for rate limited
            elif status == 200:
                status_str = f"\033[92m{status}\033[0m"  # Green color for success
            else:
                status_str = f"\033[93m{status}\033[0m"  # Yellow for other responses
                
            print(f"[{result['timestamp']}] Request {result['request_num']}: "
                  f"Status {status_str} - {result['duration']:.3f}s")
    
    # Analyze results
    statuses = Counter([r["status"] for r in results])
    print("\n" + "=" * 60)
    print("Results Summary:")
    for status, count in statuses.items():
        status_name = "Rate Limited" if status == 429 else (
                      "Success" if status == 200 else "Other")
        print(f"  {status} ({status_name}): {count} requests")
    
    successful = statuses.get(200, 0)
    rate_limited = statuses.get(429, 0)
    print(f"\nSuccess Rate: {successful / num_requests * 100:.1f}%")
    print(f"Rate Limited: {rate_limited / num_requests * 100:.1f}%")
    
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test NGINX Rate Limiting")
    parser.add_argument("url", help="URL to test")
    parser.add_argument("-n", "--num-requests", type=int, default=20,
                        help="Number of requests to send (default: 20)")
    parser.add_argument("-c", "--concurrency", type=int, default=10,
                        help="Number of concurrent requests (default: 10)")
    args = parser.parse_args()
    
    run_test(args.url, args.num_requests, args.concurrency)
