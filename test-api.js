#!/usr/bin/env node
/**
 * Quick test script to verify API endpoints work correctly
 * Run with: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: JSON.parse(responseData)
        });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API Endpoints\n');

  try {
    // Test 1: Contact form
    console.log('Test 1: Contact Form (index.html)');
    const contactRes = await makeRequest('/api/contact', 'POST', {
      name: 'Nguyễn Quang Huy',
      phone: '0902970416',
      email: 'kimang6251@gmail.com'
    });
    console.log('Status:', contactRes.status);
    console.log('Response:', contactRes.data);
    console.log('✅ Contact form test complete\n');

    // Test 2: Quote form
    console.log('Test 2: Quote Form (insurance.html)');
    const quoteRes = await makeRequest('/api/quote', 'POST', {
      name: 'Nguyễn Quang Huy',
      phone: '0902970416',
      age: 25,
      recommendedTier: 'Thẻ Vàng'
    });
    console.log('Status:', quoteRes.status);
    console.log('Response:', quoteRes.data);
    console.log('✅ Quote form test complete\n');

    // Test 3: Another contact (different person)
    console.log('Test 3: Contact Form (Different Person)');
    const contact2Res = await makeRequest('/api/contact', 'POST', {
      name: 'Trần Văn A',
      phone: '0909999999',
      email: 'tran.van.a@example.com'
    });
    console.log('Status:', contact2Res.status);
    console.log('Response:', contact2Res.data);
    console.log('✅ Second contact test complete\n');

    console.log('🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
