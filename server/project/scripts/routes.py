from . import scripts_blueprint

@scripts_blueprint.route("/", methods=["POST"])
def test():
    return "Test successful", 200
