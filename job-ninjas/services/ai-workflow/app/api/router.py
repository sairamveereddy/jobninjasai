from fastapi import APIRouter
from typing import Dict, Any

api_router = APIRouter()

@api_router.post("/workflows/{workflow_id}/execute")
async def execute_workflow(workflow_id: str, payload: Dict[str, Any]):
    """
    Mock endpoint to trigger a workflow execution.
    Returns a mock execution ID.
    """
    return {"execution_id": f"exec_mock_{workflow_id}_123", "status": "queued"}

@api_router.get("/executions/{execution_id}")
async def get_execution_status(execution_id: str):
    """
    Mock endpoint to get status of an execution.
    """
    return {"execution_id": execution_id, "status": "succeeded"}
