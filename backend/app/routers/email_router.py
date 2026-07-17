from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Response
from app.schemas.schemas import (
    EmailGenerationRequest, EmailResponse, EmailHistoryResponse,
    FavoriteRequest, RegenerateRequest, ExportEmailRequest, EmailVariation, SendGmailRequest
)
from app.services.email_service import email_service
from app.utils.exporter import export_email_to_pdf, export_email_to_txt

router = APIRouter()

@router.post("/generate", response_model=EmailResponse)
async def generate_emails(req: EmailGenerationRequest):
    try:
        return await email_service.generate_campaign(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Email Generation Failed: {str(e)}"
        )

@router.post("/regenerate", response_model=List[EmailVariation])
async def regenerate_email(req: RegenerateRequest):
    try:
        res = await email_service.regenerate_variation(req.id, req.variation_index)
        return res["posts"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Email Variation Regeneration Failed: {str(e)}"
        )

@router.get("/history", response_model=List[EmailHistoryResponse])
async def get_history_logs():
    history_entries = await email_service.get_history()
    results = []
    for entry in history_entries:
        posts_list = entry.generated_content.get("posts", []) if isinstance(entry.generated_content, dict) else entry.generated_content
        results.append(
            EmailHistoryResponse(
                id=str(entry.id),
                campaign_name=entry.campaign_name,
                email_type=entry.email_type,
                target_audience=entry.target_audience,
                product_name=entry.product_name,
                generated_content=posts_list,
                favorite=entry.favorite,
                created_at=entry.created_at
            )
        )
    return results

@router.delete("/history/{id}", status_code=status.HTTP_200_OK)
async def delete_log_entry(id: str):
    success = await email_service.delete_history_entry(id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email history log not found."
        )
    return {"success": True, "message": "Archived log deleted successfully."}

@router.post("/favorite", status_code=status.HTTP_200_OK)
async def toggle_log_favorite(req: FavoriteRequest):
    success = await email_service.toggle_favorite(req.id, req.favorite)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email history log not found."
        )
    return {"success": True, "message": "Favorite status updated."}

@router.post("/export/pdf")
def export_pdf(req: ExportEmailRequest):
    pdf_bytes = export_email_to_pdf(req.post.dict(), req.campaign_name)
    headers = {
        'Content-Disposition': f'attachment; filename="aethera_email_{req.campaign_name.replace(" ", "_")}.pdf"'
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)

@router.post("/export/txt")
def export_txt(req: ExportEmailRequest):
    txt_content = export_email_to_txt(req.post.dict(), req.campaign_name)
    headers = {
        'Content-Disposition': f'attachment; filename="aethera_email_{req.campaign_name.replace(" ", "_")}.txt"'
    }
    return Response(content=txt_content, media_type="text/plain", headers=headers)

@router.post("/send-gmail", status_code=status.HTTP_200_OK)
def send_gmail(req: SendGmailRequest):
    try:
        success = email_service.send_gmail_email(
            sender_email=req.sender_email,
            app_password=req.app_password,
            recipient_email=req.recipient_email,
            subject=req.subject,
            body=req.body
        )
        return {"success": True, "message": "Email sent successfully via Gmail."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Gmail SMTP Delivery Failed: {str(e)}"
        )
