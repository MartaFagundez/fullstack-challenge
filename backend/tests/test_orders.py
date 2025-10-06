def test_create_order_requires_valid_user_and_amount(client):
    # sin usuario, debe fallar
    r1 = client.post("/orders", json={"user_id": 999, "product_name":"X", "amount": 10})
    assert r1.status_code == 422

    # crear usuario válido
    u = client.post("/users", json={"name":"Grace","email":"grace@example.com"}).get_json()

    # amount inválido
    r2 = client.post("/orders", json={"user_id": u["id"], "product_name":"X", "amount": 0})
    assert r2.status_code == 422

    # ok
    r3 = client.post("/orders", json={"user_id": u["id"], "product_name":"Notebook", "amount": 12.5})
    assert r3.status_code == 201
    assert float(r3.get_json()["amount"]) > 0

def test_orders_amount_invalid_type(client):
    u = client.post("/users", json={"name":"Bob","email":"bob@example.com"}).get_json()
    r = client.post("/orders", json={"user_id": u["id"], "product_name":"X", "amount":"abc"})
    assert r.status_code == 422