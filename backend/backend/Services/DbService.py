from .. import db
from ..Models import *
from sqlalchemy import select

# Get a record from a model/table


def DbGetOne(tableStr, columnStr, searchKey):
    if (not (columnStr and searchKey)):
        return None

    result = []
    resultProxy = db.session.execute(
        f"SELECT * FROM {tableStr} WHERE {columnStr}=\"{searchKey}\"")
    for row in resultProxy:
        result.append(row._mapping)

    if (len(result)):
        return result[0]
    else:
        return None

# Get some records from a model/table


def DbGetMany(tableStr, columnStr=None, searchKey=None):
    if (not (columnStr and searchKey)):
        return None

    # validating for injections
    if '-' or ';' in tableStr or columnStr or searchKey:
        return None

    result = []
    resultProxy = db.session.execute(
        f"SELECT * FROM {tableStr} { f'WHERE {columnStr}={searchKey}' if (columnStr and searchKey) else ''}")
    for row in resultProxy:
        result.append(row._mapping)

    if (len(result)):
        return result[0]
    else:
        return None

# Delete record from a table


def DbDelMany(tableStr, columnStr, searchKey):
    if (not (columnStr and searchKey)):
        return None

    # validating for injections
    if '-' or ';' in tableStr or columnStr or searchKey:
        return None

    resultProxy = db.session.execute(
        f'DELETE FROM {tableStr} WHERE {columnStr}={searchKey}')
    print(resultProxy)


# add one or many record to a table
# records as a array
def DbAddMany(record):
    db.session.add_all(record)
    db.session.commit()
    db.session.close()
