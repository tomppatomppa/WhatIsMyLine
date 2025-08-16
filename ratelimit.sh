#!/bin/bash

# URL to test rate limiting against
URL="https://whatsmylines.com"

# Number of requests to send
NUM_REQUESTS=30

# Counter for successful and failed requests
SUCCESS_COUNT=0
FAIL_COUNT=0

echo "Sending $NUM_REQUESTS requests rapidly to $URL"
echo "======================================"

for (( i=1; i<=$NUM_REQUESTS; i++ ))
do
    # Send request and capture HTTP status code
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)
    
    # Check if the request was successful (200) or rate limited (429)
    if [ $HTTP_STATUS -eq 200 ]; then
        echo "Request $i: SUCCESS ($HTTP_STATUS)"
        ((SUCCESS_COUNT++))
    elif [ $HTTP_STATUS -eq 429 ]; then
        echo "Request $i: RATE LIMITED ($HTTP_STATUS)"
        ((FAIL_COUNT++))
    else
        echo "Request $i: OTHER RESPONSE ($HTTP_STATUS)"
        ((FAIL_COUNT++))
    fi
    
    # No delay between requests to trigger rate limiting
done

echo "======================================"
echo "Results: $SUCCESS_COUNT successful, $FAIL_COUNT failed/limited"