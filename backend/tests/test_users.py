def test_create_user_ok(client):
    r = client.post("/users", json={"name":"Ada","email":"ada@example.com"})
    assert r.status_code == 201
    data = r.get_json()
    assert data["id"] > 0
    assert data["email"] == "ada@example.com"

def test_create_user_duplicate_email(client):
    client.post("/users", json={"name":"Ada","email":"dup@example.com"})
    r = client.post("/users", json={"name":"Ada 2","email":"dup@example.com"})
    assert r.status_code in (409, 422)

def test_users_invalid_json(client):
    r = client.post("/users", data="no-json", headers={"Content-Type":"application/json"})
    assert r.status_code in (400, 422)

def test_users_list_search_and_pagination(client):
    client.post("/users", json={"name":"Ana", "email":"ana@example.com"})
    r = client.get("/users?q=ana&page=1&limit=1")
    assert r.status_code == 200
    assert "items" in r.get_json()
