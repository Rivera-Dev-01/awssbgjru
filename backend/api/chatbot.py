from groq import Groq

from . import config
from . import prompts
from . import guardrails

client = Groq(api_key=config.GROQ_API_KEY)


def generate(message):
    is_safe, error = guardrails.check_input(message)
    if not is_safe:
        yield {"token": error}
        return

    messages = [
        {"role": "system", "content": prompts.SYSTEM_PROMPT},
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
