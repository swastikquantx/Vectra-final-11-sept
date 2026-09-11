
import os
FOUNDER_EMAILS=[e.strip().lower() for e in os.getenv('FOUNDER_EMAILS','akhil718@gmail.com').split(',')]
def resolve_role(email, db_role):
    if email and email.lower() in FOUNDER_EMAILS: return 'founder'
    return db_role or 'user'
# In /api/auth/me endpoint:
# user['role']=resolve_role(user['email'], user.get('role'))
# All /api/admin/* routes check: if user['role'] not in ['founder','admin']: raise 403
# Removed: fal_client, FAL_KEY, LTX imports and calls
# Replaced with: from providers.google_veo import GoogleVeoVideoProvider
