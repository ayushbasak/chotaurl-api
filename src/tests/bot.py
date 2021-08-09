import requests
import random
import time
import sys

if(len(sys.argv) is not 2):
	sys.exit()

actionURL = 'https://ctlnk.herokuapp.com/q' if sys.argv[1] == 'prod' else 'http://localhost:5000'
t0 = time.time()
urls = []
with open('urls.txt') as f:
    for line in f:
        urls.append(line.split('\n')[0])

N = int(input("Enter number of requests\n"))

for i in range(N):
    url = random.choice(urls)
    p = requests.post(url = actionURL, json = {'url': url})

t0 = time.time() - t0
print("\nTotal Time over ", i+1, " successfull requests :\t" , round(t0, 2), " s")
print("Average Time over ", i+1, " successfull requests :\t" , round(t0/(i+1), 2), " s")