const { test } = require('node:test');
const assert = require('node:assert/strict');

const API_URL = process.env.API_URL || 'http://127.0.0.1:3000';

test('Product API healthcheck and CRUD', async () => {
  const pid = `TEST-${Date.now()}`;
  const headers = {
    'Content-Type': 'application/json'
  };

  let created = false;

  try {
    // 1. Healthcheck
    const healthResponse = await fetch(`${API_URL}/health`);
    assert.equal(healthResponse.status, 200);

    const health = await healthResponse.json();
    assert.equal(health.status, 'UP');
    assert.equal(health.mongodb, 'CONNECTED');

    // 2. POST - Create product
    const postResponse = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        pid,
        pname: 'Test Product',
        price: 15000000,
        quantity: 10
      })
    });

    assert.equal(postResponse.status, 201);
    created = true;

    const product = await postResponse.json();
    assert.equal(product.pid, pid);
    assert.equal(product.quantity, 10);

    // 3. GET - Find product by PID
    const getResponse = await fetch(
      `${API_URL}/api/products/${pid}`
    );

    assert.equal(getResponse.status, 200);

    const foundProduct = await getResponse.json();
    assert.equal(foundProduct.pname, 'Test Product');

    // 4. PUT - Update product
    const putResponse = await fetch(
      `${API_URL}/api/products/${pid}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          pname: 'Updated Test Product',
          price: 16000000,
          quantity: 20
        })
      }
    );

    assert.equal(putResponse.status, 200);

    const updatedProduct = await putResponse.json();
    assert.equal(updatedProduct.pname, 'Updated Test Product');
    assert.equal(updatedProduct.price, 16000000);
    assert.equal(updatedProduct.quantity, 20);

    // 5. DELETE - Remove product
    const deleteResponse = await fetch(
      `${API_URL}/api/products/${pid}`,
      { method: 'DELETE' }
    );

    assert.equal(deleteResponse.status, 200);
    created = false;

    // 6. Verify deletion
    const verifyResponse = await fetch(
      `${API_URL}/api/products/${pid}`
    );

    assert.equal(verifyResponse.status, 404);
  } finally {
    // Clean up test data if a test fails midway
    if (created) {
      await fetch(`${API_URL}/api/products/${pid}`, {
        method: 'DELETE'
      }).catch(() => {});
    }
  }
});