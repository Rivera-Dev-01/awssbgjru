DIVISION_STATUS = {
    "office": {
        "Relations": "open",
        "Operations": "open",
        "Technology": "open",
        "Creatives": "open",
        "Marketing": "full",
        "Media": "full",
    },
    "skillbuilder": {
        "Software & Web Dev.": "full",
        "Security": "not_recruiting",
        "Data Analyst": "open",
        "Cloud Computing": "open",
        "Machine Learning & AI": "open",
        "Advanced Network & Infrastructure": "not_recruiting",
    },
}


class DivisionAvailabilityError(ValueError):
    def __init__(self, code: str, message: str, status_code: int):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code


def validate_division_availability(division_type: str, division_name: str) -> None:
    if not isinstance(division_type, str):
        raise DivisionAvailabilityError(
            "invalid_division_type",
            'division_type must be "office" or "skillbuilder"',
            422,
        )

    divisions = DIVISION_STATUS.get(division_type)
    if divisions is None:
        raise DivisionAvailabilityError(
            "invalid_division_type",
            'division_type must be "office" or "skillbuilder"',
            422,
        )

    if not isinstance(division_name, str):
        raise DivisionAvailabilityError(
            "invalid_division",
            "The selected division is not recognized.",
            422,
        )

    status = divisions.get(division_name)
    if status is None:
        raise DivisionAvailabilityError(
            "invalid_division",
            "The selected division is not recognized.",
            422,
        )
    if status != "open":
        raise DivisionAvailabilityError(
            "division_unavailable",
            "This team is full! Please choose another!",
            409,
        )
