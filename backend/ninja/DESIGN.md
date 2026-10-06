# AI Ninja Backend Orchestration (Native)

This package contains the native FastAPI implementation of the AI Ninja core workflows, replacing the legacy n8n-based orchestration.

## Architecture Overview

The system follows a modular design to handle interview session management, third-party API integration, and database persistence.

### Components

1.  **`call_launcher.py`**: The primary orchestrator for initiating interview sessions.
    *   Resolves user profiles from RDS.
    *   Coordinates question generation.
    *   Interacts with `vapi_client.py` to trigger outbound calls.
    *   Logs initial attempt state in RDS.

2.  **`questions.py`**: Handles dynamic question generation using OpenAI's GPT-4o.
    *   Uses the candidate's resume and current roadmap topics to tailor questions.
    *   Outputs a structured system prompt for the Vapi assistant.

3.  **`vapi_client.py`**: A clean wrapper around the Vapi.ai REST API.
    *   Handles authentication and outbound call triggering.
    *   Supports assistant overrides for dynamic behavior.

4.  **`vapi_webhook.py`**: Processes incoming post-call reports from Vapi.
    *   Parses transcripts, summaries, and structured analysis.
    *   Maps results back to users via RDS.
    *   Updates user stats (streaks, last completed day).

5.  **`dodo_webhook.py`**: Manages subscription and payment events from Dodo Payments.
    *   Synchronizes payment status with the `ninja_plans` table.
    *   Handles tier mapping (daily, weekly, monthly).

## Data Flow (Interview Session)

1.  **Frontend**: User clicks "Start Today's Call".
2.  **FastAPI**: `POST /api/ninja/v2/call` calls `launch_call()`.
3.  **OpenAI**: Generates questions based on roadmap.
4.  **Vapi**: Receives `POST /call/phone` request.
5.  **Phone**: User receives and completes the call.
6.  **Vapi Webhook**: Sends `end-of-call-report` to `/api/vapi/webhook`.
7.  **RDS**: Updates `call_results` and increments user streak.
8.  **Dashboard**: Reflects new stats on next refresh.

## Benefits of Native Orchestration

*   **Reliability**: Removes the n8n dependency, reducing failure points.
*   **Latency**: Faster end-to-end processing by avoiding external relay overhead.
*   **Consistency**: Centralizes all logic in the primary Python codebase, making debugging and testing easier.
*   **Scalability**: Allows for more complex logic (e.g., custom feedback loops) that were difficult to implement in n8n.
