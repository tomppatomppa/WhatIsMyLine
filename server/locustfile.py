import uuid
from locust import HttpUser, task, between
import random
#locust -f locustfile.py --headless -u 1000 -r 10 -t 5m --host http://localhost:5000
# locust -f locustfile.py --headless -u 1000 -r 10 -t 5m --host http://localhost:5000 --csv=report_name --csv-full-history --html=whatsmyline_report.html
# --csv=report_name --csv-full-history --html=whatsmyline_report.html
class WebsiteUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        # pick one of the seeded test users
        email = f"testuser_{random.randint(0, 999)}@gmail.com"
        resp = self.client.post("/api/auth/test_login", json={"email": email})
        if resp.status_code == 200:
            self.cookies = resp.cookies
        else:
            self.cookies = None

    def _headers(self):
        return {"Cookie": "; ".join([f"{k}={v}" for k, v in self.cookies.items()])} if self.cookies else {}

    @task(3)
    def list_scripts(self):
        user_id = random.randint(1, 1000)
        self.client.get(f"/api/user", headers=self._headers())

    @task(1)
    def create_script(self):
        script_id = str(uuid.uuid4())
        self.client.get(
            "/api/scripts",
           
            headers=self._headers()
        )