import time
from datetime import datetime

today = str(datetime.now())
date = today.split(" ")[0]
now = today.split(" ")[1].split(".")[0]
print(date)
print(now)
