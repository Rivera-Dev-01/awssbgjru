import unittest

from backend.registration_availability import (
    DivisionAvailabilityError,
    validate_division_availability,
)


class RegistrationAvailabilityTests(unittest.TestCase):
    def test_open_divisions_are_accepted(self):
        self.assertIsNone(validate_division_availability("office", "Relations"))
        self.assertIsNone(validate_division_availability("skillbuilder", "Data Analyst"))

    def test_full_divisions_return_conflict(self):
        for division_type, division_name in (
            ("office", "Marketing"),
            ("office", "Media"),
            ("skillbuilder", "Software & Web Dev."),
        ):
            with self.subTest(division_name=division_name):
                with self.assertRaises(DivisionAvailabilityError) as raised:
                    validate_division_availability(division_type, division_name)
                self.assertEqual(raised.exception.status_code, 409)
                self.assertEqual(raised.exception.code, "division_unavailable")

    def test_not_recruiting_divisions_return_conflict(self):
        for name in ("Security", "Advanced Network & Infrastructure"):
            with self.subTest(division_name=name):
                with self.assertRaises(DivisionAvailabilityError) as raised:
                    validate_division_availability("skillbuilder", name)
                self.assertEqual(raised.exception.status_code, 409)
                self.assertEqual(raised.exception.code, "division_unavailable")

    def test_unknown_division_returns_unprocessable_entity(self):
        with self.assertRaises(DivisionAvailabilityError) as raised:
            validate_division_availability("office", "Unknown")
        self.assertEqual(raised.exception.status_code, 422)
        self.assertEqual(raised.exception.code, "invalid_division")

    def test_invalid_type_returns_unprocessable_entity(self):
        with self.assertRaises(DivisionAvailabilityError) as raised:
            validate_division_availability("club", "Relations")
        self.assertEqual(raised.exception.status_code, 422)
        self.assertEqual(raised.exception.code, "invalid_division_type")


if __name__ == "__main__":
    unittest.main()
