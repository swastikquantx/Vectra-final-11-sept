
from enum import Enum
class ConnectorState(str, Enum):
    CONNECTED='CONNECTED'; NOT_CONNECTED='NOT_CONNECTED'; EXPIRED='EXPIRED'; ERROR='ERROR'
SUPPORTED=['youtube','instagram','facebook']
class DistributionHub:
    def __init__(self, db): self.db=db
    async def get_status(self, user_id, platform):
        token=await self.db.oauth_tokens.find_one({'user_id':user_id,'platform':platform})
        if not token: return {'platform':platform,'state':ConnectorState.NOT_CONNECTED,'reason':'NOT_CONFIGURED'}
        if token.get('expired'): return {'platform':platform,'state':ConnectorState.EXPIRED}
        if token.get('error'): return {'platform':platform,'state':ConnectorState.ERROR}
        return {'platform':platform,'state':ConnectorState.CONNECTED}
    async def get_all_status(self, user_id):
        return {p: await self.get_status(user_id,p) for p in SUPPORTED}
