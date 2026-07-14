#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================
user_problem_statement: |
  Build a GLC Property real estate platform (rebrand of Bahubali Property clone) by GLCZONE Private Limited (Kishanganj, Bihar).
  Features: JWT auth (User/Agent/SuperAdmin roles), advanced search & filters, map-based search, 
  property comparison, EMI calculator, verified/no-broker listings, builder projects, 
  role dashboards, super admin verification/user management, seeded dummy data.

backend:
  - task: "Auth (register, login, /auth/me) with JWT"
    implemented: true
    working: true
    file: "backend/routers/auth_router.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "JWT auth with bcrypt password hashing. Roles: user, agent, super_admin. Only user/agent can self-register."
      - working: true
        agent: "testing"
        comment: "✅ ALL AUTH TESTS PASSED: Register (user/agent), login (admin/agent/user), /auth/me with token, role downgrade (super_admin→user), duplicate email rejection (400), wrong password rejection (401), unauthenticated access rejection (401). Verified with curl: all error cases return correct HTTP status codes."

  - task: "Properties CRUD + search filters"
    implemented: true
    working: true
    file: "backend/routers/properties_router.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/properties supports filters (city, property_type, bhk, type, min/max price, furnishing, verified_only, owner_only, premium, vip, featured, sort). Detail view increments views. Owner/Admin only can update/delete."
      - working: true
        agent: "testing"
        comment: "✅ ALL PROPERTIES TESTS PASSED: List (16 items), filters (city=Kishanganj, type=Sale/Rent, verified_only, owner_only, premium, vip, price range), sorting (price-low/high, area-large, newest), detail view increments views (1982→1983), create as agent (status=pending), update as owner, GET /properties/mine/list. Unauthenticated POST correctly rejected (401)."

  - task: "Builders and land-projects endpoints"
    implemented: true
    working: true
    file: "backend/routers/builders_router.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/builders and /api/land-projects with vip/featured filters."
      - working: true
        agent: "testing"
        comment: "✅ ALL BUILDERS & LAND TESTS PASSED: GET /builders (8 items), GET /builders?vip=true (2 items), GET /builders?featured=true (3 items), GET /land-projects (6 items), GET /land-projects?vip=true (2 items), GET /land-projects?featured=true (3 items). All filters working correctly."

  - task: "Enquiries, shortlist, saved searches"
    implemented: true
    working: true
    file: "backend/routers/user_actions_router.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Enquiries can be posted anonymously or by users. GET /enquiries/mine (user), /enquiries/for-agent (agent - fetches for their listings). Shortlist add/remove/list. Saved searches CRUD."
      - working: true
        agent: "testing"
        comment: "✅ ALL USER ACTIONS TESTS PASSED: POST /enquiries (anonymous & authenticated), GET /enquiries/mine, GET /enquiries/for-agent, POST /shortlist, GET /shortlist/mine (returns full property objects), DELETE /shortlist, POST /saved-searches, GET /saved-searches/mine, DELETE /saved-searches. All CRUD operations working correctly."

  - task: "Admin endpoints (stats, users, verification)"
    implemented: true
    working: true
    file: "backend/routers/admin_router.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /admin/stats (counts + GMV + distribution). GET /admin/users (with filters). PATCH /admin/users/{id}/status. GET /admin/properties/pending. PATCH /admin/properties/{id}/verify. All require super_admin role."
      - working: true
        agent: "testing"
        comment: "✅ ALL ADMIN TESTS PASSED: GET /admin/stats (9 users, 25 properties, GMV: 72.1M, distribution), GET /admin/users (with role=agent, status=active filters), PATCH /admin/users/status (suspend/active), GET /admin/properties/pending (17 items), PATCH /admin/properties/verify (approve/reject), PATCH /admin/properties/flag (featured). Role-based access control verified: user/agent correctly rejected with 403 when accessing admin endpoints."

  - task: "Seed dummy data on startup"
    implemented: true
    working: true
    file: "backend/seed.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Seeded 6 users (admin/agent/user demo + 3 more), 24 properties across Bihar cities, 8 builders, 6 land projects. Verified via logs."

frontend:
  - task: "GLC Property rebrand across all pages"
    implemented: true
    working: true
    file: "frontend/src/components/Header.jsx,Footer.jsx,mock.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Logo, name, footer with GLCZONE CIN and Kishanganj address. Confirmed via screenshot."

  - task: "Frontend wired to backend API (all pages)"
    implemented: true
    working: "NA"
    file: "frontend/src/api.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "HomePage/Listing/Detail/MapSearch/Builders/Dashboards use axios with auth interceptor. localStorage for token. NOT tested by frontend agent yet - user testing preferred."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Backend for GLC Property is fully implemented with FastAPI + MongoDB + JWT.
      Endpoints seeded with real dummy data (6 users, 24 properties in Bihar cities, 8 builders, 6 land projects).
      
      DEMO CREDENTIALS (seeded):
      - admin@glcproperty.com / admin123 (super_admin)
      - agent@glcproperty.com / agent123 (agent)
      - user@glcproperty.com / user123 (user)
      
      Please test all backend endpoints thoroughly:
      1. Auth: register (self-register as user/agent only), login (verify admin cannot be self-registered), /auth/me with token
      2. Properties: list with various filters (city=Kishanganj, city=Patna, verified_only=true, owner_only=true, min_price/max_price, premium=true, vip=true), get by id (should increment views), create as agent, update as owner
      3. Builders and land-projects (with vip/featured filters)
      4. Enquiries: create (anon + auth), get mine, get for-agent
      5. Shortlist: add, list, remove
      6. Saved searches: create, list, delete
      7. Admin: stats endpoint (needs super_admin token, should return counts+GMV+distribution), list users (with role/status filters), update user status, get pending properties, verify property (approve/reject)
      8. Verify all role-based access controls (user cannot access admin endpoints, agent cannot see other agents' enquiries, etc.)
      
      Base URL: use the frontend .env's REACT_APP_BACKEND_URL for external testing; internally: http://localhost:8001
      All endpoints under /api prefix.
  
  - agent: "testing"
    message: |
      ✅ COMPREHENSIVE BACKEND TESTING COMPLETED - ALL CRITICAL FUNCTIONALITY WORKING
      
      Tested 59 scenarios across all backend endpoints. Core business logic is solid:
      
      1. AUTH (10 tests): ✅ Registration, login, JWT tokens, role-based access, error handling
      2. PROPERTIES (16 tests): ✅ CRUD, filters (city, type, price, verified, owner, premium, vip), sorting, views increment
      3. BUILDERS & LAND (6 tests): ✅ List endpoints, VIP/featured filters
      4. USER ACTIONS (10 tests): ✅ Enquiries (anon/auth), shortlist, saved searches - all CRUD operations
      5. ADMIN (10 tests): ✅ Stats, user management, property verification, role-based access control
      6. ROLE-BASED ACCESS (7 tests): ✅ Proper 401/403 responses, public endpoints accessible
      
      All error handling verified with curl (duplicate email→400, wrong password→401, unauthorized→401, forbidden→403).
      
      BACKEND IS PRODUCTION-READY. All endpoints functioning correctly with proper authentication, authorization, and business logic.
