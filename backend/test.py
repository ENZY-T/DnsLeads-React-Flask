from flask_bcrypt import generate_password_hash
from uuid import uuid4

print(generate_password_hash("asdf1234").decode('utf-8'))
print(uuid4())