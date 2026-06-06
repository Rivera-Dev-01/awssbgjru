import re

BLOCKED_PATTERNS = [
    r"(?i)\b(hack|exploit)\s+(the|a)\s+(system|server|database)\b",
    r"(?i)\b(how\s+to\s+)?(crack|cracked)\b",
]

CODE_PATTERNS = [
    r"(?i)\b(code|write|generate|implement|program|script|function)\s+(a|an|the|me|this)\s+(calculator|app|tool|bot|website|api|crawler|scraper|automation)\b",
    r"(?i)\b(teach|show|give|provide|build|make|create)\s+(me|us)?\s*(how\s+to\s+)?(code|program|script)\b",
]

MAX_INPUT_LENGTH = 500
MAX_OUTPUT_LENGTH = 500


def check_input(text):
    if not text or not text.strip():
        return False, "Message cannot be empty"

    if len(text) > MAX_INPUT_LENGTH:
        return False, "Message is too long"

    for pattern in BLOCKED_PATTERNS + CODE_PATTERNS:
        if re.search(pattern, text):
            return False, "I can only answer questions about the AWS Learning Club. Want to know about our events or how to join?"

    return True, None


def check_output(text):
    if len(text) > MAX_OUTPUT_LENGTH:
        return False, "Response exceeded maximum length"

    if "```" in text:
        return False, "Response contained blocked content"

    return True, None
