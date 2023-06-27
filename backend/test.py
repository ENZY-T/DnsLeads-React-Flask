from datetime import datetime, timedelta

original_time = datetime.strptime("18:08", '%H:%M')
new_time = original_time + timedelta(hours=2)
job_ended_time = new_time.strftime('%H:%M')

print(job_ended_time)