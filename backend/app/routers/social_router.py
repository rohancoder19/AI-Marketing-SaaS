from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Response
from app.schemas.schemas import (
    PostGenerationRequest, GenerationResponse, HistoryResponse,
    FavoriteRequest, RegenerateRequest, ExportRequest
)
from app.services.social_service import social_service
from app.utils.exporter import export_to_pdf, export_to_txt

router = APIRouter()

@router.post("/generate", response_model=GenerationResponse)
async def generate_posts(req: PostGenerationRequest):
    try:
        return await social_service.generate_campaign(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Campaign Generation Failed: {str(e)}"
        )

@router.post("/regenerate", response_model=List[dict])
async def regenerate_post(req: RegenerateRequest):
    try:
        res = await social_service.regenerate_variation(req.id, req.variation_index)
        return res["posts"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Variation Regeneration Failed: {str(e)}"
        )

@router.get("/history", response_model=List[HistoryResponse])
async def get_history_logs():
    history_entries = await social_service.get_history()
    # Beanie returns models. We need to adapt the generated_content back to list of variations
    results = []
    for entry in history_entries:
        # Convert generated_content dict to list
        posts_list = entry.generated_content.get("posts", []) if isinstance(entry.generated_content, dict) else entry.generated_content
        results.append(
            HistoryResponse(
                id=str(entry.id),
                topic=entry.topic,
                description=entry.description,
                platform=entry.platform or "",
                tone=entry.tone or "",
                campaign_goal=entry.campaign_goal or "",
                target_audience=entry.target_audience,
                generated_content=posts_list,
                image_prompt=entry.image_prompt,
                favorite=entry.favorite,
                created_at=entry.created_at
            )
        )
    return results

@router.delete("/history/{id}", status_code=status.HTTP_200_OK)
async def delete_log_entry(id: str):
    success = await social_service.delete_history_entry(id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign history log not found."
        )
    return {"success": True, "message": "Archived log deleted successfully."}

@router.post("/favorite", status_code=status.HTTP_200_OK)
async def toggle_log_favorite(req: FavoriteRequest):
    success = await social_service.toggle_favorite(req.id, req.favorite)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign history log not found."
        )
    return {"success": True, "message": "Favorite status updated."}

@router.post("/export/pdf")
def export_pdf(req: ExportRequest):
    pdf_bytes = export_to_pdf(req.post, req.topic, req.platform)
    headers = {
        'Content-Disposition': f'attachment; filename="aethera_{req.platform.lower()}_post.pdf"'
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)

@router.post("/export/txt")
def export_txt(req: ExportRequest):
    txt_content = export_to_txt(req.post, req.topic, req.platform)
    headers = {
        'Content-Disposition': f'attachment; filename="aethera_{req.platform.lower()}_post.txt"'
    }
    return Response(content=txt_content, media_type="text/plain", headers=headers)
