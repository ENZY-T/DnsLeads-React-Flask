from functools import wraps
from flask import Response, request, g
from backend.allFunctions import GetJwtFromRequest, CheckJwtBlacklisted, userObjToDict
from backend.Services.DbService import DbGetOne
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask_cors import CORS


# @CORS
def AuthorizationRequired(role="user"):
    '''
      Role based access required
    '''
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Authenticate
            try:
                jwt = GetJwtFromRequest(request)
            except Exception as e:
                return Response('Authentication failed', mimetype='application/json', status=401)

            if (CheckJwtBlacklisted(jwt)):
                return Response('Authentication failed', mimetype='application/json', status=401)

            else:
                verify_jwt_in_request()
                currentUserId = get_jwt_identity()
                user = DbGetOne('Users', 'id', currentUserId)
                if (user == None):
                    return Response('Authentication failed', mimetype='application/json', status=401)

                userDict = userObjToDict(user, False)
            #

            # Authorization
            if (userDict['role'] != role):
                return Response('Authorization failed', mimetype='application/json', status=401)
            #
            g.token = jwt
            g.user = userDict

            return func(*args, **kwargs)
        return wrapper
    return decorator
