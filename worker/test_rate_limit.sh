for i in {1..15}; do
  curl -X POST https://qp-worker.neurosift.app/api/completion \
    -H "Content-Type: application/json" \
    -d '{"model":"openai/gpt-4.1-mini","systemMessage":"test","messages":[],"tools":[]}'
  sleep 1
done
