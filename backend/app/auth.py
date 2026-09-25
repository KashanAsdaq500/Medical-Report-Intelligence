import os
from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from clerk_backend_api import authenticate_request, AuthenticateRequestOptions

from app.config import settings


AUTHORIZED_PARTIES = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://medical-report-intelligence-fronten-livid.vercel.app",
]


def require_user(request: Request) -> str:
    """
    Verify the Clerk session token sent by the frontend
    and return the authenticated Clerk user ID.
    """
    if not settings.CLERK_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Clerk authentication is not configured on the backend."
        )

    try:
        state = authenticate_request(
            request,
            AuthenticateRequestOptions(
                secret_key=settings.CLERK_SECRET_KEY,
                authorized_parties=AUTHORIZED_PARTIES,
                accepts_token=["session_token"],
            ),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication verification failed: {str(exc)}",
        ) from exc

    if not state.is_signed_in:
        reason = getattr(state.reason, "name", None) or "unauthorized"

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=reason,
        )

    user_id = state.payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user ID was not found in the Clerk session.",
        )

    return str(user_id)


CurrentUser = Annotated[str, Depends(require_user)]