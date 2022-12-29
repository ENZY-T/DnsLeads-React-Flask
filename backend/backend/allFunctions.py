import re


def userObjToDict(obj):
    return {
        "id": str(obj.id),
        "name": str(obj.name),
        "address": str(obj.address),
        "zip_code": str(obj.zip_code),
        "contact_no": str(obj.contact_no),
        "email": str(obj.email),
        "abn": str(obj.abn),
        "passport_number": str(obj.passport_number),
        "bank_name": str(obj.bank_name),
        "account_type": str(obj.account_type),
        "account_name": str(obj.account_name),
        "account_number": str(obj.account_number),
        "bsb": str(obj.bsb),
        "address_proof_img": str(obj.address_proof_img),
        "passport_img": str(obj.passport_img),
        "police_check_img": str(obj.police_check_img),
        "children_check_img": str(obj.children_check_img),
        "agreement_img": str(obj.agreement_img),
        "verified": bool(obj.verified),
        "password": str(obj.password),
    }


def usersObjToDictArr(objarr):
    allUsers = []
    for usr in objarr:
        tmp = userObjToDict(usr)
        allUsers.append(tmp)
    return allUsers


def txtValidation(txt, typeOfTxt):
    if typeOfTxt == "email":
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if re.findall(regex, txt):
            return True
        else:
            return False

    elif typeOfTxt == "azs":
        regex = r'[a-z\s]*'
        if re.fullmatch(regex, txt):
            return True
        else:
            return False

    elif typeOfTxt == "09":
        if len(txt) == 10:
            regex = r'[0-9]*'
            if re.fullmatch(regex, txt):
                return True
            else:
                return False
        else:
            return False

    elif typeOfTxt == "desc":
        if len(txt) == 10:
            regex = r'[a-z|0-9\s]*'
            if re.fullmatch(regex, txt):
                return True
            else:
                return False
        else:
            return False


# a = "uhuisdtg suhgerdhgerg hergie rgoie ergediug"
# b = "uashgfusfhguids"
# c = "0451570605"
# d = "Lorem ipsum dolor 18:90 sit amet co18nsectetur adipisicing elit. Quam voluptatibus in expedita tenetur hic! Molestiae at cum illo minus quam reiciendis veritatis impedit vitae, fugit incidunt quod distinctio assumenda. Eius soluta adipisci accusamus nisi illo nemo esse consequatur, itaque quis animi, ex iste voluptatibus eos ullam laudantium sequi numquam nihil."
# print(txtValidation(a, "desc"))
