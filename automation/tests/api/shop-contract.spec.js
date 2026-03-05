const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');
const { ShopApiService } = require('../../services/ShopApiService');

test('Contract Test - shop API schema validation', async ({ request }) => {
  const shopApiService = new ShopApiService(request);
  const { response, body } = await shopApiService.fetchProducts('ring');
  expect(response.status()).toBe(200);

  const schema = {
    type: 'object',
    required: ['status', 'data'],
    properties: {
      status: { type: 'string' },
      data: {
        type: 'object',
        required: ['products'],
        properties: {
          products: {
            type: 'object',
            required: ['data'],
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'name', 'slug', 'price'],
                  properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    price: {
                      type: 'object',
                      properties: {
                        USD: {
                          type: 'object',
                          required: ['price'],
                          properties: {
                            price: { type: 'number' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  const valid = validate(body);

  expect(valid).toBe(true);

});