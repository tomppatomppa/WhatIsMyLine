from utils import time_difference


def test_set_page_width_zero_throws_error() -> None:
    str_err = "Token used too early, 1688624049 < 1688624050. Check that your computer's clock is set correctly."
    assert time_difference(str_err) == 1