def test_export_import_users(client):
    # export vacío
    e0 = client.get("/export/users").get_json()
    assert e0["items"] == []

    # importar dos, con un duplicado
    r = client.post("/import/users", json={
        "items":[
            {"name":"Jane","email":"jane@example.com"},
            {"name":"Jane 2","email":"jane@example.com"}  # duplicado
        ]
    })
    assert r.status_code == 201
    body = r.get_json()
    assert body["created"] == 1
    assert body["skipped"] >= 1

    # export con 1
    e1 = client.get("/export/users").get_json()
    assert len(e1["items"]) == 1

def test_import_users_missing_items(client):
    r = client.post("/import/users", json={})
    assert r.status_code in (400, 422)