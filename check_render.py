import sys, json

data = json.load(sys.stdin)
for s in data:
    name = s['service']['name']
    url = s['service']['serviceDetails'].get('url', '')
    sid = s['service']['id']
    print(f"{name:40s} | {url:40s} | {sid}")