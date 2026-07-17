from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Response
from app.schemas.schemas import (
    AdvertisementGenerationRequest, AdvertisementResponse, AdvertisementHistoryResponse,
    FavoriteRequest, RegenerateRequest, ExportRequest, AdVariation
)
from app.services.advertisement_service import advertisement_service
from app.utils.exporter import export_to_pdf, export_to_txt

router = APIRouter()

@router.post("/generate", response_model=AdvertisementResponse)
async def generate_ads(req: AdvertisementGenerationRequest):
    try:
        return await advertisement_service.generate_campaign(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Advertisement Generation Failed: {str(e)}"
        )

@router.post("/regenerate", response_model=List[AdVariation])
async def regenerate_ad(req: RegenerateRequest):
    try:
        res = await advertisement_service.regenerate_variation(req.id, req.variation_index)
        return res["posts"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Variation Regeneration Failed: {str(e)}"
        )

@router.get("/history", response_model=List[AdvertisementHistoryResponse])
async def get_history_logs():
    history_entries = await advertisement_service.get_history()
    results = []
    for entry in history_entries:
        posts_list = entry.generated_content.get("posts", []) if isinstance(entry.generated_content, dict) else entry.generated_content
        results.append(
            AdvertisementHistoryResponse(
                id=str(entry.id),
                campaign_name=entry.campaign_name,
                platform=entry.platform,
                objective=entry.objective,
                product=entry.product,
                brand=entry.brand,
                audience=entry.audience,
                generated_content=posts_list,
                image_prompt=entry.image_prompt,
                favorite=entry.favorite,
                created_at=entry.created_at
            )
        )
    return results

@router.delete("/history/{id}", status_code=status.HTTP_200_OK)
async def delete_log_entry(id: str):
    success = await advertisement_service.delete_history_entry(id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertisement history log not found."
        )
    return {"success": True, "message": "Archived log deleted successfully."}

@router.post("/favorite", status_code=status.HTTP_200_OK)
async def toggle_log_favorite(req: FavoriteRequest):
    success = await advertisement_service.toggle_favorite(req.id, req.favorite)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertisement history log not found."
        )
    return {"success": True, "message": "Favorite status updated."}

@router.post("/export/pdf")
def export_pdf(req: ExportRequest):
    pdf_bytes = export_to_pdf(req.post.dict(), req.topic, req.platform)
    headers = {
        'Content-Disposition': f'attachment; filename="aethera_{req.platform.lower()}_ad.pdf"'
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)

@router.post("/export/txt")
def export_txt(req: ExportRequest):
    txt_content = export_to_txt(req.post.dict(), req.topic, req.platform)
    headers = {
        'Content-Disposition': f'attachment; filename="aethera_{req.platform.lower()}_ad.txt"'
    }
    return Response(content=txt_content, media_type="text/plain", headers=headers)
