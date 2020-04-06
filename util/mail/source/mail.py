import imaplib, email, sys
from pprint import pprint as pp
#--------------------------------------------------------------------------------------
#-- Author: Britton LaRoche
#-- Company: MongoDB
#-- Date: 04/03/2020
#--------------------------------------------------------------------------------------
#- Notes:
#- You will need to modify the login and password with a google app pasword key
#- See the following url to get the app password: 
#- https://support.google.com/accounts/answer/185833
#
#- Replace this line with your information:
#- mail.login('your.name@10gen.com','yourapppassword')
#
#- Original file by Jerry Neumann: https://www.quora.com/ post on how to get addresses 
#- from your own gmail account.
#- This file was modified to look for a particluar company name in the to address field
#- It will search the whole thread and give you a list of all the TO, CC and From 
#- addresses in your inbox
#- It has been modified to filter out all the MongoDB and 10gen email adresses.
#- simply call:
#- 
#- python mail.py companyname
#- to export to a file use the redirect command
#- python mail.py companyname > companyname.txt
#--------------------------------------------------------------------------------------
def split_addrs(s):
    #split an address list into list of tuples of (name,address)
    if not(s): return []
    s = s.lower()
    outQ = True
    cut = -1
    res = []
    check = 0
    for i in range(len(s)):
        if s[i]=='"': outQ = not(outQ)
        if outQ and s[i]==',':
            check = check_unwanted(str(email.utils.parseaddr(s[cut+1:i])))
            if (check == -1):
                res.append(email.utils.parseaddr(s[cut+1:i]))
            cut=i
    check = check_unwanted(str(email.utils.parseaddr(s[cut+1:i+1])))
    if (check == -1 ):
        res.append(email.utils.parseaddr(s[cut+1:i+1]))
    return res

def check_unwanted(sAddr):
    #check for our company and filter out the results
    found = -1
    found = sAddr.find('10gen')
    if (found > 0 ):
        return found
    found =  sAddr.find('mongodb')  
    return found

mail=imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('your.name@10gen.com','yourapppassword')
mail.select("inbox")
company = ''
if (len(sys.argv) == 2):
    company = sys.argv[1]
if (len(company) == 0 ):
    company = raw_input("enter company abbreviation in email address ie: 7-11 or att: ")
result,data=mail.search(None,'(TO "' + company + '")')
ids=data[0].split()
msgs = mail.fetch(','.join(ids),'(BODY.PEEK[HEADER])')[1][0::2]
addr=[]
for x,msg in msgs:
    msgobj = email.message_from_string(msg)
    addr.extend(split_addrs(msgobj['to']))
    addr.extend(split_addrs(msgobj['from']))
    addr.extend(split_addrs(msgobj['cc']))
pp(set(addr))
