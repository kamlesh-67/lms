# LMD Portal - API & Database Documentation

## 1. Database Schema

The following schema represents the data models used in the application.

### **Users Table**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| name | VARCHAR | Full Name |
| email | VARCHAR | Unique Email |
| password_hash | VARCHAR | Hashed Password |
| role | ENUM | 'admin', 'operations', 'supervisor' |
| avatar | VARCHAR | URL to avatar image |
| preferences | JSON | User settings (notifications, theme, etc.) |
| created_at | TIMESTAMP | Creation date |
| last_login | TIMESTAMP | Last login timestamp |

### **Shipments Table**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| awb | VARCHAR | Unique AWB Number |
| order_id | VARCHAR | External Order ID |
| consignee_name | VARCHAR | Customer Name |
| consignee_phone | VARCHAR | Customer Phone |
| address | TEXT | Delivery Address |
| weight | DECIMAL | Package Weight (kg) |
| service_type | VARCHAR | e.g., 'Express', 'Standard' |
| status | ENUM | 'Created', 'Pickup Assigned', 'Picked', 'In Transit', 'Delivered', 'Failed', 'Cancelled', 'Delayed', 'RTO' |
| manifest_id | UUID | Foreign Key -> Manifests.id |
| is_locked | BOOLEAN | True if included in a closed manifest |
| is_delayed | BOOLEAN | Flag for delayed shipments |
| is_rto | BOOLEAN | Flag for Return to Origin |
| cancellation_reason | TEXT | Reason if cancelled |
| pod_url | VARCHAR | URL to Proof of Delivery image |
| pod_signature | VARCHAR | URL to Digital Signature |
| last_scan | JSON | Latest scan details `{ location, timestamp, hub }` |
| created_at | TIMESTAMP | Creation date |

### **ShipmentTimeline Table**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| shipment_id | UUID | Foreign Key -> Shipments.id |
| status | VARCHAR | Status at this point |
| location | VARCHAR | Location name |
| timestamp | TIMESTAMP | Event time |
| description | TEXT | Optional details |

### **Pickups Table**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| request_id | VARCHAR | Unique Request ID |
| scheduled_date | TIMESTAMP | Scheduled pickup time |
| address | TEXT | Pickup Address |
| status | ENUM | 'Requested', 'Assigned', 'Picked', 'Failed' |
| rider_id | UUID | Foreign Key -> Users.id (Rider) |
| awb_number | VARCHAR | Linked AWB |
| failure_reason | TEXT | Reason if failed |
| remarks | TEXT | Additional notes |
| contact_name | VARCHAR | Contact Person |
| contact_phone | VARCHAR | Contact Number |
| location | VARCHAR | Area/Zone for filtering |

### **Manifests Table**
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Primary Key (e.g., MAN-001) |
| date | DATE | Manifest Date |
| status | ENUM | 'Open', 'Closed' |
| generated_by | UUID | Foreign Key -> Users.id |
| shipment_count | INT | Number of shipments |
| closed_at | TIMESTAMP | Closure time |
| created_at | TIMESTAMP | Creation date |

### **AuditLogs Table**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key -> Users.id |
| action | VARCHAR | e.g., 'CREATE_SHIPMENT', 'LOGIN' |
| entity_type | VARCHAR | e.g., 'SHIPMENT', 'USER' |
| entity_id | VARCHAR | ID of the affected entity |
| details | JSON | Changes made (old vs new values) |
| timestamp | TIMESTAMP | Time of action |
| ip_address | VARCHAR | User IP Address |

### **ApiHistory Table**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| endpoint | VARCHAR | API Path (e.g., /api/shipments) |
| method | VARCHAR | GET, POST, PUT, DELETE |
| status_code | INT | HTTP Status (200, 400, 500) |
| duration_ms | INT | Execution time in ms |
| user_id | UUID | Foreign Key -> Users.id (Optional) |
| payload | JSON | Request body (sanitized) |
| response | JSON | Response body (sanitized) |
| timestamp | TIMESTAMP | Request time |

---

## 2. API Endpoints

### **Authentication**
#### `POST /api/auth/login`
- **Description:** Authenticate user and return token.
- **Payload:**
  ```json
  {
    "email": "admin@lmd.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "123",
      "name": "Admin User",
      "role": "admin",
      "preferences": { "notifications": true }
    }
  }
  ```

### **Dashboard & Analytics**
#### `GET /api/analytics/overview`
- **Description:** Get monthly shipment volumes.
- **Response:**
  ```json
  [
    { "name": "Jan", "total": 120 },
    { "name": "Feb", "total": 150 }
  ]
  ```

#### `GET /api/analytics/activity`
- **Description:** Get recent operational activity feed.
- **Response:**
  ```json
  [
    {
      "id": "1",
      "message": "Shipment #AWB123 created",
      "time": "2 minutes ago",
      "type": "success"
    }
  ]
  ```

### **Shipments**
#### `GET /api/shipments`
- **Description:** Get list of shipments with filtering.
- **Query Params:** `page`, `limit`, `status`, `search`
- **Response:**
  ```json
  {
    "data": [ ... ],
    "total": 100,
    "page": 1
  }
  ```

#### `POST /api/shipments`
- **Description:** Create a new shipment.
- **Payload:**
  ```json
  {
    "awb": "AWB123456",
    "consigneeName": "John Doe",
    "address": "Dubai, UAE",
    "weight": 2.5,
    "serviceType": "Express"
  }
  ```
- **Response:** `201 Created` with created shipment object.

#### `PUT /api/shipments/{id}/status`
- **Description:** Update shipment status.
- **Payload:**
  ```json
  {
    "status": "Delivered",
    "location": "Dubai Hub",
    "timestamp": "2024-02-18T10:00:00Z",
    "podUrl": "https://...",
    "podSignature": "https://..."
  }
  ```

### **Pickups**
#### `POST /api/pickups/schedule`
- **Description:** Schedule a new pickup.
- **Payload:**
  ```json
  {
    "address": "Warehouse 1, DIP",
    "scheduledDate": "2024-02-19T09:00:00Z",
    "serviceType": "Standard",
    "contactName": "Jane Smith",
    "contactPhone": "+971500000000"
  }
  ```

#### `POST /api/pickups/{id}/assign`
- **Description:** Assign a rider to a pickup.
- **Payload:**
  ```json
  {
    "riderId": "rider_123"
  }
  ```

### **Documents & Manifests**
#### `POST /api/manifests`
- **Description:** Create a new manifest from selected shipments.
- **Payload:**
  ```json
  {
    "shipmentIds": ["ship_1", "ship_2", "ship_3"]
  }
  ```

#### `POST /api/manifests/{id}/close`
- **Description:** Close a manifest and lock associated shipments.
- **Response:** `200 OK`

### **Admin & Audit**
#### `GET /api/admin/audit-logs`
- **Description:** Retrieve audit logs.
- **Query Params:** `userId`, `action`, `startDate`, `endDate`
- **Response:** List of audit log entries.

#### `GET /api/admin/api-history`
- **Description:** Retrieve API call history.
- **Query Params:** `endpoint`, `statusCode`, `startDate`, `endDate`
- **Response:** List of API history entries.

#### `POST /api/admin/api-history/retrigger`
- **Description:** Retrigger a past API request.
- **Payload:**
  ```json
  {
    "endpoint": "/api/shipments",
    "method": "POST",
    "payload": { ... }
  }
  ```
- **Response:** New API history entry with result.

### **Settings**
#### `GET /api/settings`
- **Description:** Get system and user preferences.
- **Response:**
  ```json
  {
    "platformName": "LMD Portal",
    "notifications": { "email": true, "sms": false }
  }
  ```

#### `PUT /api/settings`
- **Description:** Update settings.
- **Payload:**
  ```json
  {
    "notifications": { "email": false }
  }
  ```
