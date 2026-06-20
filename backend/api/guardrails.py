import re

NON_LATIN_BLOCKS = [
    (0x4E00, 0x9FFF),  # CJK Unified Ideographs (Chinese, Japanese, Korean)
    (0x3040, 0x309F),  # Hiragana (Japanese)
    (0x30A0, 0x30FF),  # Katakana (Japanese)
    (0xAC00, 0xD7AF),  # Hangul Syllables (Korean)
    (0x1100, 0x11FF),  # Hangul Jamo (Korean)
    (0x0600, 0x06FF),  # Arabic
    (0x0400, 0x04FF),  # Cyrillic
    (0x0500, 0x052F),  # Cyrillic Supplement
    (0x0900, 0x097F),  # Devanagari
    (0x0E00, 0x0E7F),  # Thai
    (0x0F00, 0x0FFF),  # Tibetan
    (0x10A0, 0x10FF),  # Georgian
    (0x0590, 0x05FF),  # Hebrew
    (0x1B00, 0x1B7F),  # Balinese
    (0x0B00, 0x0B7F),  # Oriya
    (0x0C00, 0x0C7F),  # Telugu
    (0x0D00, 0x0D7F),  # Malayalam
    (0x0B80, 0x0BFF),  # Tamil
    (0x0980, 0x09FF),  # Bengali
    (0x0A00, 0x0A7F),  # Gurmukhi
    (0x0A80, 0x0AFF),  # Gujarati
]

MAX_NON_LATIN_RATIO = 0.2


def has_non_latin_script(text):
    if not text:
        return False
    total = 0
    non_latin = 0
    for ch in text:
        if ch.isspace():
            continue
        total += 1
        cp = ord(ch)
        for lo, hi in NON_LATIN_BLOCKS:
            if lo <= cp <= hi:
                non_latin += 1
                break
    if total == 0:
        return False
    return (non_latin / total) > MAX_NON_LATIN_RATIO


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

    if has_non_latin_script(text):
        return False, "I can only respond in English or Tagalog. Please ask your question in one of these languages."

    for pattern in BLOCKED_PATTERNS + CODE_PATTERNS:
        if re.search(pattern, text):
            return False, "I can only answer questions about the AWS Student Builder Group - JRU. Want to know about our events or how to join?"

    return True, None


def check_output(text):
    if len(text) > MAX_OUTPUT_LENGTH:
        return False, "Response exceeded maximum length"

    if "```" in text:
        return False, "Response contained blocked content"

    return True, None
