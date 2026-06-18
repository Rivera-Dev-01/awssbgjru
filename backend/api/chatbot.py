from groq import Groq

import config
import prompts
import guardrails

try:
    from backend.rag import get_context
    _rag_available = True
except Exception:
    _rag_available = False

client = Groq(api_key=config.GROQ_API_KEY)


def generate(message):
    is_safe, error = guardrails.check_input(message)
    if not is_safe:
        yield {"token": error}
        return

    context = ""
    if _rag_available:
        try:
            context = get_context(message)
        except Exception:
            context = ""
    system_content = prompts.SYSTEM_PROMPT
    if context:
        system_content += (
            "\n\nHere is information from the AWS Student Builder Group - JRU website "
            "that may help answer the user's question:\n\n"
            f"{context}"
        )

    messages = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": message},
    ]

    try:
        stream = client.chat.completions.create(
            model=config.GROQ_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=512,
            stream=True,
        )

        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield {"token": content}

        yield {"token": "[DONE]"}

    except Exception as e:
        yield {"error": str(e)}
