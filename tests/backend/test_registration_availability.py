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

    def test_non_string_division_types_return_unprocessable_entity(self):
        for division_type in ([], {}):
            with self.subTest(division_type=division_type):
                try:
                    validate_division_availability(division_type, "Relations")
                except DivisionAvailabilityError as exc:
                    self.assertEqual(exc.status_code, 422)
                    self.assertEqual(exc.code, "invalid_division_type")
                except Exception as exc:
                    self.fail(f"Unexpected exception: {type(exc).__name__}")
                else:
                    self.fail("Expected DivisionAvailabilityError")

    def test_non_string_division_names_return_unprocessable_entity(self):
        for division_name in ([], {}):
            with self.subTest(division_name=division_name):
                try:
                    validate_division_availability("office", division_name)
                except DivisionAvailabilityError as exc:
                    self.assertEqual(exc.status_code, 422)
                    self.assertEqual(exc.code, "invalid_division")
                except Exception as exc:
                    self.fail(f"Unexpected exception: {type(exc).__name__}")
                else:
                    self.fail("Expected DivisionAvailabilityError")


if __name__ == "__main__":
    unittest.main()
