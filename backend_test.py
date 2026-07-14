#!/usr/bin/env python3
"""
Comprehensive Backend Test Suite for GLC Property API
Tests all endpoints with proper authentication and role-based access control
"""

import requests
import json
from typing import Dict, Optional

# Base URL from frontend .env
BASE_URL = "https://homesearch-pro-19.preview.emergentagent.com/api"

# Demo credentials (seeded)
ADMIN_CREDS = {"email": "admin@glcproperty.com", "password": "admin123"}
AGENT_CREDS = {"email": "agent@glcproperty.com", "password": "agent123"}
USER_CREDS = {"email": "user@glcproperty.com", "password": "user123"}

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def log_test(name: str, passed: bool, message: str = ""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if message:
        print(f"   {message}")
    
    if passed:
        test_results["passed"].append(name)
    else:
        test_results["failed"].append({"test": name, "message": message})

def log_warning(name: str, message: str):
    """Log warning"""
    print(f"⚠️  WARNING: {name}")
    print(f"   {message}")
    test_results["warnings"].append({"test": name, "message": message})

def make_request(method: str, endpoint: str, token: Optional[str] = None, 
                 json_data: Optional[Dict] = None, params: Optional[Dict] = None) -> requests.Response:
    """Make HTTP request with optional auth"""
    url = f"{BASE_URL}{endpoint}"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    try:
        if method == "GET":
            return requests.get(url, headers=headers, params=params, timeout=15)
        elif method == "POST":
            return requests.post(url, headers=headers, json=json_data, timeout=15)
        elif method == "PUT":
            return requests.put(url, headers=headers, json=json_data, timeout=15)
        elif method == "PATCH":
            return requests.patch(url, headers=headers, json=json_data, params=params, timeout=15)
        elif method == "DELETE":
            return requests.delete(url, headers=headers, timeout=15)
    except Exception as e:
        # Silently handle exceptions - the calling code will check for None
        return None

print("=" * 80)
print("GLC PROPERTY BACKEND API TEST SUITE")
print("=" * 80)
print(f"Base URL: {BASE_URL}\n")

# ============================================================================
# 1. AUTH TESTS
# ============================================================================
print("\n" + "=" * 80)
print("1. AUTH ENDPOINTS (/api/auth)")
print("=" * 80)

# Test 1.1: Register new user with role='user'
print("\n[1.1] Register new user with role='user'")
new_user_data = {
    "name": "Rajesh Kumar",
    "email": "rajesh.kumar@test.com",
    "phone": "9876543210",
    "password": "test123",
    "role": "user"
}
resp = make_request("POST", "/auth/register", json_data=new_user_data)
if resp and resp.status_code == 200:
    data = resp.json()
    if "token" in data and "user" in data and data["user"]["role"] == "user":
        log_test("Register user with role='user'", True, f"User created: {data['user']['email']}")
        new_user_token = data["token"]
    else:
        log_test("Register user with role='user'", False, "Missing token or user in response")
else:
    log_test("Register user with role='user'", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 1.2: Try to register with role='super_admin' (should downgrade to 'user')
print("\n[1.2] Register with role='super_admin' (should downgrade to 'user')")
admin_attempt = {
    "name": "Fake Admin",
    "email": "fake.admin@test.com",
    "phone": "9876543211",
    "password": "test123",
    "role": "super_admin"
}
resp = make_request("POST", "/auth/register", json_data=admin_attempt)
if resp and resp.status_code == 200:
    data = resp.json()
    if data["user"]["role"] == "user":
        log_test("Register super_admin downgraded to user", True, "Role correctly downgraded to 'user'")
    else:
        log_test("Register super_admin downgraded to user", False, f"Role is {data['user']['role']}, expected 'user'")
else:
    log_test("Register super_admin downgraded to user", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 1.3: Register agent role
print("\n[1.3] Register with role='agent'")
agent_data = {
    "name": "Priya Sharma",
    "email": "priya.sharma@test.com",
    "phone": "9876543212",
    "password": "test123",
    "role": "agent"
}
resp = make_request("POST", "/auth/register", json_data=agent_data)
if resp and resp.status_code == 200:
    data = resp.json()
    if data["user"]["role"] == "agent":
        log_test("Register agent", True, f"Agent created: {data['user']['email']}")
        test_agent_token = data["token"]
    else:
        log_test("Register agent", False, f"Role is {data['user']['role']}, expected 'agent'")
else:
    log_test("Register agent", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 1.4: Register with duplicate email
print("\n[1.4] Register with duplicate email (should fail)")
resp = make_request("POST", "/auth/register", json_data=new_user_data)
if resp and resp.status_code == 400:
    log_test("Register duplicate email returns 400", True, "Correctly rejected duplicate email")
else:
    log_test("Register duplicate email returns 400", False, f"Status: {resp.status_code if resp else 'No response'}, expected 400")

# Test 1.5: Login with admin credentials
print("\n[1.5] Login with admin credentials")
resp = make_request("POST", "/auth/login", json_data=ADMIN_CREDS)
if resp and resp.status_code == 200:
    data = resp.json()
    if "token" in data and data["user"]["role"] == "super_admin":
        log_test("Login as admin", True, f"Admin logged in: {data['user']['email']}")
        admin_token = data["token"]
    else:
        log_test("Login as admin", False, "Missing token or incorrect role")
else:
    log_test("Login as admin", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 1.6: Login with agent credentials
print("\n[1.6] Login with agent credentials")
resp = make_request("POST", "/auth/login", json_data=AGENT_CREDS)
if resp and resp.status_code == 200:
    data = resp.json()
    if "token" in data and data["user"]["role"] == "agent":
        log_test("Login as agent", True, f"Agent logged in: {data['user']['email']}")
        agent_token = data["token"]
    else:
        log_test("Login as agent", False, "Missing token or incorrect role")
else:
    log_test("Login as agent", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 1.7: Login with user credentials
print("\n[1.7] Login with user credentials")
resp = make_request("POST", "/auth/login", json_data=USER_CREDS)
if resp and resp.status_code == 200:
    data = resp.json()
    if "token" in data and data["user"]["role"] == "user":
        log_test("Login as user", True, f"User logged in: {data['user']['email']}")
        user_token = data["token"]
    else:
        log_test("Login as user", False, "Missing token or incorrect role")
else:
    log_test("Login as user", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 1.8: Login with wrong password
print("\n[1.8] Login with wrong password (should fail)")
wrong_creds = {"email": "admin@glcproperty.com", "password": "wrongpassword"}
resp = make_request("POST", "/auth/login", json_data=wrong_creds)
if resp and resp.status_code == 401:
    log_test("Login with wrong password returns 401", True, "Correctly rejected wrong password")
else:
    log_test("Login with wrong password returns 401", False, f"Status: {resp.status_code if resp else 'No response'}, expected 401")

# Test 1.9: GET /auth/me with token
print("\n[1.9] GET /auth/me with valid token")
resp = make_request("GET", "/auth/me", token=admin_token)
if resp and resp.status_code == 200:
    data = resp.json()
    if "password" not in data and "email" in data:
        log_test("GET /auth/me with token", True, f"User profile returned without password")
    else:
        log_test("GET /auth/me with token", False, "Password field present in response or missing email")
else:
    log_test("GET /auth/me with token", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 1.10: GET /auth/me without token
print("\n[1.10] GET /auth/me without token (should fail)")
resp = make_request("GET", "/auth/me")
if resp and resp.status_code == 401:
    log_test("GET /auth/me without token returns 401", True, "Correctly rejected request without token")
else:
    log_test("GET /auth/me without token returns 401", False, f"Status: {resp.status_code if resp else 'No response'}, expected 401")

# ============================================================================
# 2. PROPERTIES TESTS
# ============================================================================
print("\n" + "=" * 80)
print("2. PROPERTIES ENDPOINTS (/api/properties)")
print("=" * 80)

# Test 2.1: GET /properties (no filters)
print("\n[2.1] GET /properties (no filters)")
resp = make_request("GET", "/properties")
if resp and resp.status_code == 200:
    data = resp.json()
    if "items" in data and "total" in data and len(data["items"]) >= 16:
        log_test("GET /properties returns items", True, f"Returned {len(data['items'])} items, total: {data['total']}")
        # Store a property ID for later tests
        if data["items"]:
            test_property_id = data["items"][0]["id"]
    else:
        log_test("GET /properties returns items", False, f"Items: {len(data.get('items', []))}, expected >= 16")
else:
    log_test("GET /properties returns items", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.2: Filter by city (Kishanganj)
print("\n[2.2] GET /properties?city=Kishanganj")
resp = make_request("GET", "/properties", params={"city": "Kishanganj"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data["items"] and all("Kishanganj" in item.get("city", "") for item in data["items"]):
        log_test("Filter by city=Kishanganj", True, f"Returned {len(data['items'])} properties in Kishanganj")
    else:
        log_test("Filter by city=Kishanganj", False, "Not all items match city filter")
else:
    log_test("Filter by city=Kishanganj", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.3: Filter by type=Sale
print("\n[2.3] GET /properties?type=Sale")
resp = make_request("GET", "/properties", params={"type": "Sale"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data["items"] and all(item.get("type") == "Sale" for item in data["items"]):
        log_test("Filter by type=Sale", True, f"Returned {len(data['items'])} Sale properties")
    else:
        log_test("Filter by type=Sale", False, "Not all items match type filter")
else:
    log_test("Filter by type=Sale", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.4: Filter by type=Rent
print("\n[2.4] GET /properties?type=Rent")
resp = make_request("GET", "/properties", params={"type": "Rent"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data["items"] and all(item.get("type") == "Rent" for item in data["items"]):
        log_test("Filter by type=Rent", True, f"Returned {len(data['items'])} Rent properties")
    else:
        log_test("Filter by type=Rent", False, "Not all items match type filter")
else:
    log_test("Filter by type=Rent", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.5: Filter by verified_only=true
print("\n[2.5] GET /properties?verified_only=true")
resp = make_request("GET", "/properties", params={"verified_only": "true"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data["items"] and all(item.get("verified") == True for item in data["items"]):
        log_test("Filter by verified_only=true", True, f"Returned {len(data['items'])} verified properties")
    else:
        log_test("Filter by verified_only=true", False, "Not all items are verified")
else:
    log_test("Filter by verified_only=true", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.6: Filter by owner_only=true
print("\n[2.6] GET /properties?owner_only=true")
resp = make_request("GET", "/properties", params={"owner_only": "true"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data["items"] and all(item.get("owner_direct") == True for item in data["items"]):
        log_test("Filter by owner_only=true", True, f"Returned {len(data['items'])} owner-direct properties")
    else:
        log_test("Filter by owner_only=true", False, "Not all items are owner-direct")
else:
    log_test("Filter by owner_only=true", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.7: Filter by premium=true
print("\n[2.7] GET /properties?premium=true")
resp = make_request("GET", "/properties", params={"premium": "true"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data["items"] and all(item.get("premium") == True for item in data["items"]):
        log_test("Filter by premium=true", True, f"Returned {len(data['items'])} premium properties")
    else:
        log_test("Filter by premium=true", False, "Not all items are premium")
else:
    log_test("Filter by premium=true", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.8: Filter by vip=true
print("\n[2.8] GET /properties?vip=true")
resp = make_request("GET", "/properties", params={"vip": "true"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data["items"] and all(item.get("vip") == True for item in data["items"]):
        log_test("Filter by vip=true", True, f"Returned {len(data['items'])} VIP properties")
    else:
        log_test("Filter by vip=true", False, "Not all items are VIP")
else:
    log_test("Filter by vip=true", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.9: Filter by price range
print("\n[2.9] GET /properties?min_price=1000000&max_price=50000000")
resp = make_request("GET", "/properties", params={"min_price": "1000000", "max_price": "50000000"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data["items"] and all(1000000 <= item.get("price", 0) <= 50000000 for item in data["items"]):
        log_test("Filter by price range", True, f"Returned {len(data['items'])} properties in price range")
    else:
        log_test("Filter by price range", False, "Not all items match price range")
else:
    log_test("Filter by price range", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.10: Sort by price-low
print("\n[2.10] GET /properties?sort=price-low")
resp = make_request("GET", "/properties", params={"sort": "price-low", "limit": "10"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data["items"]:
        prices = [item.get("price", 0) for item in data["items"]]
        if prices == sorted(prices):
            log_test("Sort by price-low", True, f"Properties sorted by price ascending")
        else:
            log_test("Sort by price-low", False, "Properties not sorted correctly")
    else:
        log_test("Sort by price-low", False, "No items returned")
else:
    log_test("Sort by price-low", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.11: Sort by price-high
print("\n[2.11] GET /properties?sort=price-high")
resp = make_request("GET", "/properties", params={"sort": "price-high", "limit": "10"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data["items"]:
        prices = [item.get("price", 0) for item in data["items"]]
        if prices == sorted(prices, reverse=True):
            log_test("Sort by price-high", True, f"Properties sorted by price descending")
        else:
            log_test("Sort by price-high", False, "Properties not sorted correctly")
    else:
        log_test("Sort by price-high", False, "No items returned")
else:
    log_test("Sort by price-high", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.12: GET property detail (should increment views)
print("\n[2.12] GET /properties/{id} - detail view")
resp = make_request("GET", f"/properties/{test_property_id}")
if resp and resp.status_code == 200:
    data = resp.json()
    initial_views = data.get("views", 0)
    # Request again to check views increment
    resp2 = make_request("GET", f"/properties/{test_property_id}")
    if resp2 and resp2.status_code == 200:
        data2 = resp2.json()
        if data2.get("views", 0) > initial_views:
            log_test("Property detail increments views", True, f"Views incremented from {initial_views} to {data2.get('views')}")
        else:
            log_test("Property detail increments views", False, f"Views not incremented: {initial_views} -> {data2.get('views')}")
    else:
        log_test("Property detail increments views", False, "Second request failed")
else:
    log_test("Property detail increments views", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.13: POST /properties as agent (should create with status=pending)
print("\n[2.13] POST /properties as agent")
new_property = {
    "title": "Test Property by Agent",
    "description": "A beautiful test property in Kishanganj",
    "property_type": "Apartment",
    "type": "Sale",
    "price": 2500000,
    "area": 1200,
    "bhk": 3,
    "city": "Kishanganj",
    "locality": "Test Locality",
    "address": "Test Address, Kishanganj",
    "furnishing": "Semi-Furnished",
    "possession": "Ready to Move",
    "owner_direct": True,
    "images": ["https://example.com/image1.jpg"]
}
resp = make_request("POST", "/properties", token=agent_token, json_data=new_property)
if resp and resp.status_code == 200:
    data = resp.json()
    if data.get("status") == "pending" and data.get("verified") == False:
        log_test("POST /properties as agent", True, f"Property created with status=pending, id={data.get('id')}")
        agent_property_id = data.get("id")
    else:
        log_test("POST /properties as agent", False, f"Status: {data.get('status')}, verified: {data.get('verified')}")
else:
    log_test("POST /properties as agent", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.14: POST /properties without auth (should fail)
print("\n[2.14] POST /properties without auth (should fail)")
resp = make_request("POST", "/properties", json_data=new_property)
if resp and resp.status_code == 401:
    log_test("POST /properties without auth returns 401", True, "Correctly rejected unauthenticated request")
else:
    log_test("POST /properties without auth returns 401", False, f"Status: {resp.status_code if resp else 'No response'}, expected 401")

# Test 2.15: PUT /properties/{id} as owner (agent)
print("\n[2.15] PUT /properties/{id} as owner")
updated_property = new_property.copy()
updated_property["title"] = "Updated Test Property"
resp = make_request("PUT", f"/properties/{agent_property_id}", token=agent_token, json_data=updated_property)
if resp and resp.status_code == 200:
    data = resp.json()
    if data.get("title") == "Updated Test Property":
        log_test("PUT /properties as owner", True, "Property updated successfully")
    else:
        log_test("PUT /properties as owner", False, "Title not updated")
else:
    log_test("PUT /properties as owner", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 2.16: GET /properties/mine/list
print("\n[2.16] GET /properties/mine/list as agent")
resp = make_request("GET", "/properties/mine/list", token=agent_token)
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and any(p.get("id") == agent_property_id for p in data):
        log_test("GET /properties/mine/list", True, f"Returned {len(data)} properties for agent")
    else:
        log_test("GET /properties/mine/list", False, "Agent's property not found in list")
else:
    log_test("GET /properties/mine/list", False, f"Status: {resp.status_code if resp else 'No response'}")

# ============================================================================
# 3. BUILDERS & LAND PROJECTS TESTS
# ============================================================================
print("\n" + "=" * 80)
print("3. BUILDERS & LAND PROJECTS (/api/builders, /api/land-projects)")
print("=" * 80)

# Test 3.1: GET /builders
print("\n[3.1] GET /builders")
resp = make_request("GET", "/builders")
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and len(data) >= 8:
        log_test("GET /builders", True, f"Returned {len(data)} builders")
    else:
        log_test("GET /builders", False, f"Expected >= 8 builders, got {len(data) if isinstance(data, list) else 0}")
else:
    log_test("GET /builders", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 3.2: GET /builders?vip=true
print("\n[3.2] GET /builders?vip=true")
resp = make_request("GET", "/builders", params={"vip": "true"})
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and all(b.get("is_vip") == True for b in data):
        log_test("GET /builders?vip=true", True, f"Returned {len(data)} VIP builders")
    else:
        log_test("GET /builders?vip=true", False, "Not all builders are VIP")
else:
    log_test("GET /builders?vip=true", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 3.3: GET /builders?featured=true
print("\n[3.3] GET /builders?featured=true")
resp = make_request("GET", "/builders", params={"featured": "true"})
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and all(b.get("is_featured") == True for b in data):
        log_test("GET /builders?featured=true", True, f"Returned {len(data)} featured builders")
    else:
        log_test("GET /builders?featured=true", False, "Not all builders are featured")
else:
    log_test("GET /builders?featured=true", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 3.4: GET /land-projects
print("\n[3.4] GET /land-projects")
resp = make_request("GET", "/land-projects")
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and len(data) >= 6:
        log_test("GET /land-projects", True, f"Returned {len(data)} land projects")
    else:
        log_test("GET /land-projects", False, f"Expected >= 6 land projects, got {len(data) if isinstance(data, list) else 0}")
else:
    log_test("GET /land-projects", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 3.5: GET /land-projects?vip=true
print("\n[3.5] GET /land-projects?vip=true")
resp = make_request("GET", "/land-projects", params={"vip": "true"})
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and all(l.get("is_vip") == True for l in data):
        log_test("GET /land-projects?vip=true", True, f"Returned {len(data)} VIP land projects")
    else:
        log_test("GET /land-projects?vip=true", False, "Not all land projects are VIP")
else:
    log_test("GET /land-projects?vip=true", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 3.6: GET /land-projects?featured=true
print("\n[3.6] GET /land-projects?featured=true")
resp = make_request("GET", "/land-projects", params={"featured": "true"})
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and all(l.get("is_featured") == True for l in data):
        log_test("GET /land-projects?featured=true", True, f"Returned {len(data)} featured land projects")
    else:
        log_test("GET /land-projects?featured=true", False, "Not all land projects are featured")
else:
    log_test("GET /land-projects?featured=true", False, f"Status: {resp.status_code if resp else 'No response'}")

# ============================================================================
# 4. USER ACTIONS TESTS
# ============================================================================
print("\n" + "=" * 80)
print("4. USER ACTIONS (enquiries, shortlist, saved searches)")
print("=" * 80)

# Test 4.1: POST /enquiries (anonymous)
print("\n[4.1] POST /enquiries (anonymous)")
enquiry_data = {
    "property_id": test_property_id,
    "name": "Amit Singh",
    "email": "amit.singh@test.com",
    "phone": "9876543213",
    "message": "I am interested in this property"
}
resp = make_request("POST", "/enquiries", json_data=enquiry_data)
if resp and resp.status_code == 200:
    data = resp.json()
    if data.get("property_id") == test_property_id and data.get("user_id") is None:
        log_test("POST /enquiries (anonymous)", True, f"Enquiry created without user_id")
    else:
        log_test("POST /enquiries (anonymous)", False, "Enquiry data incorrect")
else:
    log_test("POST /enquiries (anonymous)", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 4.2: POST /enquiries (authenticated)
print("\n[4.2] POST /enquiries (authenticated)")
enquiry_data_auth = {
    "property_id": test_property_id,
    "name": "Test User",
    "email": "user@glcproperty.com",
    "phone": "9876543214",
    "message": "Interested in viewing this property"
}
resp = make_request("POST", "/enquiries", token=user_token, json_data=enquiry_data_auth)
if resp and resp.status_code == 200:
    data = resp.json()
    if data.get("property_id") == test_property_id and data.get("user_id") is not None:
        log_test("POST /enquiries (authenticated)", True, f"Enquiry created with user_id")
    else:
        log_test("POST /enquiries (authenticated)", False, "Enquiry data incorrect")
else:
    log_test("POST /enquiries (authenticated)", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 4.3: GET /enquiries/mine (as user)
print("\n[4.3] GET /enquiries/mine (as user)")
resp = make_request("GET", "/enquiries/mine", token=user_token)
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list):
        log_test("GET /enquiries/mine", True, f"Returned {len(data)} enquiries for user")
    else:
        log_test("GET /enquiries/mine", False, "Response is not a list")
else:
    log_test("GET /enquiries/mine", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 4.4: GET /enquiries/for-agent (as agent)
print("\n[4.4] GET /enquiries/for-agent (as agent)")
resp = make_request("GET", "/enquiries/for-agent", token=agent_token)
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list):
        log_test("GET /enquiries/for-agent", True, f"Returned {len(data)} enquiries for agent's properties")
    else:
        log_test("GET /enquiries/for-agent", False, "Response is not a list")
else:
    log_test("GET /enquiries/for-agent", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 4.5: POST /shortlist
print("\n[4.5] POST /shortlist")
shortlist_data = {"property_id": test_property_id}
resp = make_request("POST", "/shortlist", token=user_token, json_data=shortlist_data)
if resp and resp.status_code == 200:
    data = resp.json()
    if data.get("property_id") == test_property_id or data.get("message") == "Already shortlisted":
        log_test("POST /shortlist", True, "Property added to shortlist")
    else:
        log_test("POST /shortlist", False, "Shortlist data incorrect")
else:
    log_test("POST /shortlist", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 4.6: GET /shortlist/mine
print("\n[4.6] GET /shortlist/mine")
resp = make_request("GET", "/shortlist/mine", token=user_token)
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and any(p.get("id") == test_property_id for p in data):
        log_test("GET /shortlist/mine", True, f"Returned {len(data)} shortlisted properties")
    else:
        log_test("GET /shortlist/mine", False, "Shortlisted property not found")
else:
    log_test("GET /shortlist/mine", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 4.7: DELETE /shortlist/{property_id}
print("\n[4.7] DELETE /shortlist/{property_id}")
resp = make_request("DELETE", f"/shortlist/{test_property_id}", token=user_token)
if resp and resp.status_code == 200:
    data = resp.json()
    if data.get("ok") == True:
        log_test("DELETE /shortlist", True, "Property removed from shortlist")
    else:
        log_test("DELETE /shortlist", False, "Response incorrect")
else:
    log_test("DELETE /shortlist", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 4.8: POST /saved-searches
print("\n[4.8] POST /saved-searches")
saved_search_data = {
    "name": "3BHK in Kishanganj",
    "filters": {"city": "Kishanganj", "bhk": 3, "type": "Sale"}
}
resp = make_request("POST", "/saved-searches", token=user_token, json_data=saved_search_data)
if resp and resp.status_code == 200:
    data = resp.json()
    if data.get("name") == "3BHK in Kishanganj":
        log_test("POST /saved-searches", True, f"Saved search created, id={data.get('id')}")
        saved_search_id = data.get("id")
    else:
        log_test("POST /saved-searches", False, "Saved search data incorrect")
else:
    log_test("POST /saved-searches", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 4.9: GET /saved-searches/mine
print("\n[4.9] GET /saved-searches/mine")
resp = make_request("GET", "/saved-searches/mine", token=user_token)
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and any(s.get("id") == saved_search_id for s in data):
        log_test("GET /saved-searches/mine", True, f"Returned {len(data)} saved searches")
    else:
        log_test("GET /saved-searches/mine", False, "Saved search not found")
else:
    log_test("GET /saved-searches/mine", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 4.10: DELETE /saved-searches/{id}
print("\n[4.10] DELETE /saved-searches/{id}")
resp = make_request("DELETE", f"/saved-searches/{saved_search_id}", token=user_token)
if resp and resp.status_code == 200:
    data = resp.json()
    if data.get("ok") == True:
        log_test("DELETE /saved-searches", True, "Saved search deleted")
    else:
        log_test("DELETE /saved-searches", False, "Response incorrect")
else:
    log_test("DELETE /saved-searches", False, f"Status: {resp.status_code if resp else 'No response'}")

# ============================================================================
# 5. ADMIN ENDPOINTS TESTS
# ============================================================================
print("\n" + "=" * 80)
print("5. ADMIN ENDPOINTS (/api/admin)")
print("=" * 80)

# Test 5.1: GET /admin/stats (with admin token)
print("\n[5.1] GET /admin/stats (with admin token)")
resp = make_request("GET", "/admin/stats", token=admin_token)
if resp and resp.status_code == 200:
    data = resp.json()
    required_fields = ["users", "properties", "enquiries", "builders", "gmv", "distribution"]
    if all(field in data for field in required_fields):
        log_test("GET /admin/stats", True, f"Stats returned: {data['users']['total']} users, {data['properties']['total']} properties, GMV: {data['gmv']}")
    else:
        log_test("GET /admin/stats", False, f"Missing fields in response")
else:
    log_test("GET /admin/stats", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 5.2: GET /admin/stats without admin token (should fail)
print("\n[5.2] GET /admin/stats without admin token (should fail)")
resp = make_request("GET", "/admin/stats", token=user_token)
if resp and resp.status_code == 403:
    log_test("GET /admin/stats without admin returns 403", True, "Correctly rejected non-admin request")
else:
    log_test("GET /admin/stats without admin returns 403", False, f"Status: {resp.status_code if resp else 'No response'}, expected 403")

# Test 5.3: GET /admin/users
print("\n[5.3] GET /admin/users")
resp = make_request("GET", "/admin/users", token=admin_token)
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and len(data) >= 6:
        log_test("GET /admin/users", True, f"Returned {len(data)} users")
    else:
        log_test("GET /admin/users", False, f"Expected >= 6 users, got {len(data) if isinstance(data, list) else 0}")
else:
    log_test("GET /admin/users", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 5.4: GET /admin/users?role=agent
print("\n[5.4] GET /admin/users?role=agent")
resp = make_request("GET", "/admin/users", token=admin_token, params={"role": "agent"})
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and all(u.get("role") == "agent" for u in data):
        log_test("GET /admin/users?role=agent", True, f"Returned {len(data)} agents")
    else:
        log_test("GET /admin/users?role=agent", False, "Not all users are agents")
else:
    log_test("GET /admin/users?role=agent", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 5.5: GET /admin/users?status=active
print("\n[5.5] GET /admin/users?status=active")
resp = make_request("GET", "/admin/users", token=admin_token, params={"status": "active"})
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list) and all(u.get("status") == "active" for u in data):
        log_test("GET /admin/users?status=active", True, f"Returned {len(data)} active users")
        # Store a user ID for status update test
        if data:
            test_user_id = data[0]["id"]
    else:
        log_test("GET /admin/users?status=active", False, "Not all users are active")
else:
    log_test("GET /admin/users?status=active", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 5.6: PATCH /admin/users/{user_id}/status
print("\n[5.6] PATCH /admin/users/{user_id}/status?status=suspended")
# First, get a user to suspend (not admin)
resp = make_request("GET", "/admin/users", token=admin_token, params={"role": "user"})
if resp and resp.status_code == 200:
    users = resp.json()
    if users:
        suspend_user_id = users[0]["id"]
        resp2 = make_request("PATCH", f"/admin/users/{suspend_user_id}/status", token=admin_token, params={"status": "suspended"})
        if resp2 and resp2.status_code == 200:
            data = resp2.json()
            if data.get("status") == "suspended":
                log_test("PATCH /admin/users/status", True, f"User status updated to suspended")
                # Restore status
                make_request("PATCH", f"/admin/users/{suspend_user_id}/status", token=admin_token, params={"status": "active"})
            else:
                log_test("PATCH /admin/users/status", False, "Status not updated")
        else:
            log_test("PATCH /admin/users/status", False, f"Status: {resp2.status_code if resp2 else 'No response'}")
    else:
        log_warning("PATCH /admin/users/status", "No users available to test")
else:
    log_test("PATCH /admin/users/status", False, "Could not fetch users")

# Test 5.7: GET /admin/properties/pending
print("\n[5.7] GET /admin/properties/pending")
resp = make_request("GET", "/admin/properties/pending", token=admin_token)
if resp and resp.status_code == 200:
    data = resp.json()
    if isinstance(data, list):
        log_test("GET /admin/properties/pending", True, f"Returned {len(data)} pending properties")
        # Store a pending property ID for verification test
        if data:
            pending_property_id = data[0]["id"]
    else:
        log_test("GET /admin/properties/pending", False, "Response is not a list")
else:
    log_test("GET /admin/properties/pending", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 5.8: PATCH /admin/properties/{prop_id}/verify?approve=true
print("\n[5.8] PATCH /admin/properties/{prop_id}/verify?approve=true")
if 'pending_property_id' in locals():
    resp = make_request("PATCH", f"/admin/properties/{pending_property_id}/verify", token=admin_token, params={"approve": "true"})
    if resp and resp.status_code == 200:
        data = resp.json()
        if data.get("verified") == True and data.get("status") == "active":
            log_test("PATCH /admin/properties/verify (approve)", True, "Property approved and verified")
        else:
            log_test("PATCH /admin/properties/verify (approve)", False, f"verified={data.get('verified')}, status={data.get('status')}")
    else:
        log_test("PATCH /admin/properties/verify (approve)", False, f"Status: {resp.status_code if resp else 'No response'}")
else:
    log_warning("PATCH /admin/properties/verify (approve)", "No pending property available to test")

# Test 5.9: PATCH /admin/properties/{prop_id}/verify?approve=false
print("\n[5.9] PATCH /admin/properties/{prop_id}/verify?approve=false")
if 'agent_property_id' in locals():
    resp = make_request("PATCH", f"/admin/properties/{agent_property_id}/verify", token=admin_token, params={"approve": "false"})
    if resp and resp.status_code == 200:
        data = resp.json()
        if data.get("status") == "rejected":
            log_test("PATCH /admin/properties/verify (reject)", True, "Property rejected")
        else:
            log_test("PATCH /admin/properties/verify (reject)", False, f"status={data.get('status')}, expected 'rejected'")
    else:
        log_test("PATCH /admin/properties/verify (reject)", False, f"Status: {resp.status_code if resp else 'No response'}")
else:
    log_warning("PATCH /admin/properties/verify (reject)", "No property available to test")

# Test 5.10: PATCH /admin/properties/{prop_id}/flag?flag=featured&value=true
print("\n[5.10] PATCH /admin/properties/{prop_id}/flag?flag=featured&value=true")
resp = make_request("PATCH", f"/admin/properties/{test_property_id}/flag", token=admin_token, params={"flag": "featured", "value": "true"})
if resp and resp.status_code == 200:
    data = resp.json()
    if data.get("featured") == True:
        log_test("PATCH /admin/properties/flag", True, "Property flagged as featured")
    else:
        log_test("PATCH /admin/properties/flag", False, f"featured={data.get('featured')}, expected True")
else:
    log_test("PATCH /admin/properties/flag", False, f"Status: {resp.status_code if resp else 'No response'}")

# ============================================================================
# 6. ROLE-BASED ACCESS CONTROL TESTS
# ============================================================================
print("\n" + "=" * 80)
print("6. ROLE-BASED ACCESS CONTROL")
print("=" * 80)

# Test 6.1: Regular user cannot access /admin/stats
print("\n[6.1] Regular user cannot access /admin/stats (should return 403)")
resp = make_request("GET", "/admin/stats", token=user_token)
if resp and resp.status_code == 403:
    log_test("User cannot access /admin/stats", True, "Correctly rejected user access to admin endpoint")
else:
    log_test("User cannot access /admin/stats", False, f"Status: {resp.status_code if resp else 'No response'}, expected 403")

# Test 6.2: Agent cannot access /admin/users
print("\n[6.2] Agent cannot access /admin/users (should return 403)")
resp = make_request("GET", "/admin/users", token=agent_token)
if resp and resp.status_code == 403:
    log_test("Agent cannot access /admin/users", True, "Correctly rejected agent access to admin endpoint")
else:
    log_test("Agent cannot access /admin/users", False, f"Status: {resp.status_code if resp else 'No response'}, expected 403")

# Test 6.3: User without token cannot POST /properties
print("\n[6.3] User without token cannot POST /properties (should return 401)")
resp = make_request("POST", "/properties", json_data=new_property)
if resp and resp.status_code == 401:
    log_test("Unauthenticated cannot POST /properties", True, "Correctly rejected unauthenticated property creation")
else:
    log_test("Unauthenticated cannot POST /properties", False, f"Status: {resp.status_code if resp else 'No response'}, expected 401")

# Test 6.4: Anonymous can GET /properties
print("\n[6.4] Anonymous can GET /properties")
resp = make_request("GET", "/properties")
if resp and resp.status_code == 200:
    log_test("Anonymous can GET /properties", True, "Public access to properties list works")
else:
    log_test("Anonymous can GET /properties", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 6.5: Anonymous can GET /builders
print("\n[6.5] Anonymous can GET /builders")
resp = make_request("GET", "/builders")
if resp and resp.status_code == 200:
    log_test("Anonymous can GET /builders", True, "Public access to builders list works")
else:
    log_test("Anonymous can GET /builders", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 6.6: Anonymous can GET /land-projects
print("\n[6.6] Anonymous can GET /land-projects")
resp = make_request("GET", "/land-projects")
if resp and resp.status_code == 200:
    log_test("Anonymous can GET /land-projects", True, "Public access to land projects list works")
else:
    log_test("Anonymous can GET /land-projects", False, f"Status: {resp.status_code if resp else 'No response'}")

# Test 6.7: Anonymous can POST /enquiries
print("\n[6.7] Anonymous can POST /enquiries")
anon_enquiry = {
    "property_id": test_property_id,
    "name": "Anonymous User",
    "email": "anon@test.com",
    "phone": "9876543215",
    "message": "Interested"
}
resp = make_request("POST", "/enquiries", json_data=anon_enquiry)
if resp and resp.status_code == 200:
    log_test("Anonymous can POST /enquiries", True, "Public enquiry submission works")
else:
    log_test("Anonymous can POST /enquiries", False, f"Status: {resp.status_code if resp else 'No response'}")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)

total_tests = len(test_results["passed"]) + len(test_results["failed"])
pass_rate = (len(test_results["passed"]) / total_tests * 100) if total_tests > 0 else 0

print(f"\nTotal Tests: {total_tests}")
print(f"Passed: {len(test_results['passed'])} ({pass_rate:.1f}%)")
print(f"Failed: {len(test_results['failed'])}")
print(f"Warnings: {len(test_results['warnings'])}")

if test_results["failed"]:
    print("\n❌ FAILED TESTS:")
    for failure in test_results["failed"]:
        print(f"  - {failure['test']}")
        if failure['message']:
            print(f"    {failure['message']}")

if test_results["warnings"]:
    print("\n⚠️  WARNINGS:")
    for warning in test_results["warnings"]:
        print(f"  - {warning['test']}")
        if warning['message']:
            print(f"    {warning['message']}")

print("\n" + "=" * 80)
print("END OF TEST SUITE")
print("=" * 80)
