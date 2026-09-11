
from pydantic import BaseModel
from typing import Optional
from enum import Enum
class RAG(str, Enum): GREEN='GREEN'; AMBER='AMBER'; RED='RED'
class TaskModel(BaseModel):
    company_id:str; department_id:str; team_id:str; employee_id:str; employee_type:str; kpi_id:str; title:str
    target:float; actual:float; owner:str; due_date:str; sla:str; cost:float
    bottleneck:Optional[str]=None; exception:Optional[str]=None; trend:str='stable'; status:str='in_progress'
    @property
    def achievement_percent(self): return (self.actual/self.target*100) if self.target else 0
    @property
    def rag(self):
        ach=self.achievement_percent
        return RAG.GREEN if ach>=90 else RAG.AMBER if ach>=70 else RAG.RED
